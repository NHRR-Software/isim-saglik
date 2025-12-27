using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface IRefreshTokenRepository : IRepositoryBase<RefreshToken>
    {
        Task<RefreshToken?> GetByTokenAsync(string token);
    }
}