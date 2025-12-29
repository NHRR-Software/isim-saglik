using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace IsimSaglik.Infrastructure.Concrete
{
    public class TokenGenerator : ITokenGenerator
    {
        private readonly JwtSettings _tokenSettings;


        public TokenGenerator(IOptions<JwtSettings> tokenSettings)
        {
            _tokenSettings = tokenSettings.Value;
        }


        public TokenResponseDto GenerateTokens(User user)
        {
            var tokenResponse = new TokenResponseDto
            {
                AccessToken = GenerateAccessToken(user.Id, user.Role),
                RefreshToken = GenerateRefreshToken()
            };

            return tokenResponse;
        }


        public bool ValidateRefreshToken(RefreshToken refreshToken)
        {
            if (refreshToken == null || refreshToken.ExpiresDate < DateTime.UtcNow)
            {
                return false;
            }

            return true;
        }


        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }


        private string GenerateAccessToken(Guid userId, UserRole userRole)
        {
            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenSettings.Secret)),
                SecurityAlgorithms.HmacSha256
            );

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, userRole.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_tokenSettings.AccessTokenExpirationMinutes),
                Issuer = _tokenSettings.Issuer,
                Audience = _tokenSettings.Audience,
                SigningCredentials = credentials
            };

            return new JsonWebTokenHandler().CreateToken(tokenDescriptor);
        }
    }
}