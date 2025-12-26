using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
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


        public AuthService(
            IHttpContextAccessor httpContextAccessor,
            IRepositoryManager repositoryManager,
            ITokenGenerator tokenGenerator
            )
        {
            _httpContextAccessor = httpContextAccessor;
            _repositoryManager = repositoryManager;
            _tokenGenerator = tokenGenerator;
        }


        public async Task<TokenResponseDto> LogInAsync(LogInRequestDto dto) 
        {
            var user = await _repositoryManager.User.GetByEmailAsync(dto.Email)
                ?? throw new NotFoundException($"{nameof(User)} with email '{dto.Email}' not found.", ErrorCodes.UserNotFound);

            // TODO: Supabase auth integration for password verification

            var tokens = _tokenGenerator.GenerateTokens(user);

            var token = new Token
            {
                RefreshToken = tokens.RefreshToken,
                UserId = user.Id,
                CreatedIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                UserAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString(),
                ExpiresDate = DateTime.UtcNow.AddDays(15),
                CreatedDate = DateTime.UtcNow
            };

            await _repositoryManager.Token.CreateAsync(token);

            return tokens;
        }


        public async Task<TokenResponseDto> TokenAsync(TokenRequestDto dto) 
        {
            var token = await _repositoryManager.Token.GetTokenByRefreshTokenAsync(dto.Token)
                ?? throw new NotFoundException($"{nameof(Token)} with refresh token '{dto.Token}' not found.", ErrorCodes.TokenNotFound);

            if (!_tokenGenerator.ValidateRefreshToken(token))
            {
                throw new BadRequestException("The refresh token provided is invalid or has expired.", ErrorCodes.InvalidRefreshToken);
            }

            // TODO: User 
            var user = await _repositoryManager.User.GetByIdAsync(token.UserId);
            var tokens = _tokenGenerator.GenerateTokens(user);

            token.RefreshToken = tokens.RefreshToken;
            token.CreatedIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            token.UserAgent = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString();
            token.ExpiresDate = DateTime.UtcNow.AddDays(15);
            token.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.Token.UpdateAsync(token);

            return tokens;
        }


        public async Task LogOutAsync(TokenRequestDto dto) 
        {
            var token = await _repositoryManager.Token.GetTokenByRefreshTokenAsync(dto.Token)
                ?? throw new NotFoundException($"{nameof(Token)} with refresh token '{dto.Token}' not found.", ErrorCodes.TokenNotFound);

            await _repositoryManager.Token.DeleteAsync(token.Id);
        }
    }
}