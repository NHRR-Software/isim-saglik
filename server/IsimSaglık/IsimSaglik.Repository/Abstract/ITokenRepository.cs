using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface ITokenRepository : IRepositoryBase<Token>
    {
        Task<Token> GetTokenByRefreshTokenAsync(string refreshToken);
    }
}