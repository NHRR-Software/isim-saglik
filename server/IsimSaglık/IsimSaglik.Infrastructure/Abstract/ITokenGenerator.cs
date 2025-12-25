using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Models;

namespace IsimSaglik.Infrastructure.Abstract
{
    public interface ITokenGenerator
    {
        TokenResponseDto GenerateTokens(User user);

        bool ValidateRefreshToken(Token refreshToken);
    }
}