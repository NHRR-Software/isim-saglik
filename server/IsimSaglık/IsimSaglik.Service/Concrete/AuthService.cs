using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
using Microsoft.AspNetCore.Http;

namespace IsimSaglik.Service.Concrete
{
    public class AuthService : IAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IRepositoryManager _repositoryManager;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly ISupabaseClient _supabaseClient;


        public AuthService(
            IHttpContextAccessor httpContextAccessor,
            IRepositoryManager repositoryManager,
            ITokenGenerator tokenGenerator,
            ISupabaseClient supabaseClient
            )
        {
            _httpContextAccessor = httpContextAccessor;
            _repositoryManager = repositoryManager;
            _tokenGenerator = tokenGenerator;
            _supabaseClient = supabaseClient;
        }


        public async Task RegisterCompanyAsync(RegisterCompanyRequestDto dto)
        {
            var existingUser = await _repositoryManager.User.GetByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                throw new BadRequestException("User already exists.", ErrorCodes.UserAlreadyExists);
            }

            var session = await _supabaseClient.Auth.SignUp(dto.Email, dto.Password)
                ?? throw new BadRequestException("Registration failed at authentication provider.", ErrorCodes.UnexpectedError);

            // TODO: Default photo url 
            // TODO: Add AutoMapper mapping
            var user = new User
            {
                Email = dto.Email,
                FullName = dto.Name,
                PhoneNumber = dto.PhoneNumber,
                Gender = Gender.None,
                Role = UserRole.Company,
                BirthDate = dto.FoundingDate,
                PhotoUrl = new Uri("https://example.com/default-company-photo.png"),
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
            };

            await _repositoryManager.User.CreateAsync(user);
        }


        public async Task<TokenResponseDto> LogInAsync(LogInRequestDto dto)
        {
            Supabase.Gotrue.Session? session = null;

            try
            {
                session = await _supabaseClient.Auth.SignIn(dto.Email, dto.Password);
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

            var token = new RefreshToken
            {
                Token = tokens.RefreshToken,
                UserId = user.Id,
                CreatedIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                UserAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString(),
                ExpiresDate = DateTime.UtcNow.AddDays(15),
                CreatedDate = DateTime.UtcNow
            };

            await _repositoryManager.Token.CreateAsync(token);

            return tokens;
        }


        public async Task<TokenResponseDto> RefreshTokenAsync(TokenRequestDto dto)
        {
            var token = await _repositoryManager.Token.GetByTokenAsync(dto.Token)
                ?? throw new NotFoundException($"{nameof(RefreshToken)} with refresh token '{dto.Token}' not found.", ErrorCodes.TokenNotFound);

            if (!_tokenGenerator.ValidateRefreshToken(token))
            {
                throw new BadRequestException("The refresh token provided is invalid or has expired.", ErrorCodes.InvalidRefreshToken);
            }

            var user = await _repositoryManager.User.GetByIdAsync(token.UserId)
                ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);

            var tokens = _tokenGenerator.GenerateTokens(user);

            token.Token = tokens.RefreshToken;
            token.CreatedIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            token.UserAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString();
            token.ExpiresDate = DateTime.UtcNow.AddDays(15);
            token.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.Token.UpdateAsync(token);

            return tokens;
        }


        public async Task LogOutAsync(TokenRequestDto dto)
        {
            var token = await _repositoryManager.Token.GetByTokenAsync(dto.Token)
                ?? throw new NotFoundException($"{nameof(RefreshToken)} with refresh token '{dto.Token}' not found.", ErrorCodes.TokenNotFound);

            await _repositoryManager.Token.DeleteAsync(token.Id);
        }
    }
}