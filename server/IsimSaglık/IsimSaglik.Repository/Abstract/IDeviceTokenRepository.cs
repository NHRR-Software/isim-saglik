using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface IDeviceTokenRepository : IRepositoryBase<DeviceToken>
    {
        Task<IEnumerable<DeviceToken>?> GetTokensByUserIdAsync(Guid userId);

        Task DeleteByTokenAsync(string token);
    }
}