using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Models;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
using IsimSaglik.Service.Utilities;
using Microsoft.AspNetCore.Http;

namespace IsimSaglik.Service.Concrete
{
    public class AuthService : IAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IRepositoryManager _repositoryManager;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly ISupabaseClient _supabaseClient;
        private readonly IMapper _mapper;


        public AuthService(
            IHttpContextAccessor httpContextAccessor,
            IRepositoryManager repositoryManager,
            ITokenGenerator tokenGenerator,
            ISupabaseClient supabaseClient,
            IMapper mapper
            )
        {
            _httpContextAccessor = httpContextAccessor;
            _repositoryManager = repositoryManager;
            _tokenGenerator = tokenGenerator;
            _supabaseClient = supabaseClient;
            _mapper = mapper;
        }


        public async Task RegisterCompanyAsync(RegisterCompanyRequestDto dto)
        {
            var existingUser = await _repositoryManager.User.GetByEmailAsync(dto.Email);

            if (existingUser is not null)
            {
                // TODO: Company Already denilebilir mi?
                throw new BadRequestException("User already exists.", ErrorCodes.UserAlreadyExists);
            }

            // TODO: AdminAuth ile user oluşturulabilir
            var session = await _supabaseClient.Auth.SignUp(dto.Email, dto.Password)
                ?? throw new BadRequestException("Registration failed at authentication provider.", ErrorCodes.UnexpectedError);

            var user = _mapper.Map<User>(dto);
            user.PhotoUrl = AvatarResolver.GetDefaultUri(user.Role, user.Gender);

            await _repositoryManager.User.CreateAsync(user);
        }


        public async Task<TokenResponseDto> LogInAsync(LogInRequestDto dto)
        {
            try
            {
                var session = await _supabaseClient.Auth.SignIn(dto.Email, dto.Password);
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException)
            {
                throw new BadRequestException("Invalid email or password.", ErrorCodes.InvalidCredentials);
            }
            catch (Exception ex)
            {
                throw new BadRequestException($"Authentication failed: {ex.Message}", ErrorCodes.UnexpectedError);
            }

            var user = await _repositoryManager.User.GetByEmailAsync(dto.Email)
                ?? throw new NotFoundException($"{nameof(User)} with email '{dto.Email}' not found.", ErrorCodes.UserNotFound);

            if (!user.IsActive)
            {
                throw new BadRequestException("Your account is inactive.", ErrorCodes.AccountInactive);
            }

            var tokens = _tokenGenerator.GenerateTokens(user);

            var refreshToken = new RefreshToken
            {
                Token = tokens.RefreshToken,
                UserId = user.Id,
                CreatedIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                UserAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString(),
                ExpiresDate = DateTime.UtcNow.AddDays(15),
                CreatedDate = DateTime.UtcNow
            };

            await _repositoryManager.RefreshToken.CreateAsync(refreshToken);

            return tokens;
        }



        public async Task RegisterWithInviteAsync(RegisterWithInviteRequestDto dto) 
        {
            var authUser = await _supabaseClient.Auth.GetUser(dto.AccessToken)
                ?? throw new BadRequestException("Failed to retrieve user from authentication provider.", ErrorCodes.UnexpectedError);

            var userInvitation = await _repositoryManager.UserInvitation.GetByEmailAsync(authUser.Email)
                ?? throw new NotFoundException("Invitation not found for the provided email.", ErrorCodes.InvitationNotFound);

            if (userInvitation.IsUsed || userInvitation.ExpiresDate < DateTime.UtcNow)
            {
                throw new BadRequestException("Invitation is no longer valid.", ErrorCodes.InvitationExpired);
            }

            var userAttributes = new Supabase.Gotrue.AdminUserAttributes { Password = dto.Password };
            await _supabaseClient.AdminAuth.UpdateUserById(authUser.Id, userAttributes);

            var user = _mapper.Map<User>(dto);
            _mapper.Map(userInvitation, user);
            user.PhotoUrl = AvatarResolver.GetDefaultUri(user.Role, user.Gender);

            await _repositoryManager.User.CreateAsync(user);

            userInvitation.IsUsed = true;
            userInvitation.UpdatedDate = DateTime.UtcNow;
            await _repositoryManager.UserInvitation.UpdateAsync(userInvitation);
        }



        public async Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto dto)
        {
            var refreshToken = await _repositoryManager.RefreshToken.GetByTokenAsync(dto.Token)
                ?? throw new NotFoundException($"{nameof(RefreshToken)} with refresh token '{dto.Token}' not found.", ErrorCodes.TokenNotFound);

            if (!_tokenGenerator.ValidateRefreshToken(refreshToken))
            {
                throw new BadRequestException("The refresh token provided is invalid or has expired.", ErrorCodes.InvalidRefreshToken);
            }

            var user = await _repositoryManager.User.GetByIdAsync(refreshToken.UserId)
                ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);

            var tokens = _tokenGenerator.GenerateTokens(user);

            refreshToken.Token = tokens.RefreshToken;
            refreshToken.CreatedIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            refreshToken.UserAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString();
            refreshToken.ExpiresDate = DateTime.UtcNow.AddDays(15);
            refreshToken.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.RefreshToken.UpdateAsync(refreshToken);

            return tokens;
        }



        public async Task ForgotPasswordAsync(ForgotPasswordRequest dto) 
        {
            var user = await _repositoryManager.User.GetByEmailAsync(dto.Email)
                ?? throw new NotFoundException($"{nameof(User)} with email '{dto.Email}' not found.", ErrorCodes.UserNotFound);

            var options = new Supabase.Gotrue.ResetPasswordForEmailOptions(dto.Email)
            {
                RedirectTo = "https://isimsaglik.netlify.app/reset-password"
            };

            try
            {
                await _supabaseClient.Auth.ResetPasswordForEmail(options);
            }
            catch (Exception ex)
            {
                throw new BadRequestException($"Failed to send reset email: {ex.Message}", ErrorCodes.EmailSendingFailed);
            }
        }



        public async Task ResetPasswordAsync(ResetPasswordRequestDto dto) 
        {
            var authUser = await _supabaseClient.Auth.GetUser(dto.AccessToken)
                ?? throw new BadRequestException("Failed to retrieve user from authentication provider.", ErrorCodes.UnexpectedError);

            var attributes = new Supabase.Gotrue.AdminUserAttributes
            {
                Password = dto.Password
            };

            try
            {
                await _supabaseClient.AdminAuth.UpdateUserById(authUser.Id, attributes);
            }
            catch (Exception ex)
            {
                throw new BadRequestException($"Failed to reset password: {ex.Message}", ErrorCodes.AuthProviderError);
            }
        }



        public async Task LogOutAsync(RefreshTokenRequestDto dto)
        {
            var refreshToken = await _repositoryManager.RefreshToken.GetByTokenAsync(dto.Token)
                ?? throw new NotFoundException($"{nameof(RefreshToken)} with refresh token '{dto.Token}' not found.", ErrorCodes.TokenNotFound);

            await _repositoryManager.RefreshToken.DeleteAsync(refreshToken.Id);
        }
    }
}