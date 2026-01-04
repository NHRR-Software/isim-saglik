using IsimSaglik.Entity.DTOs.Request;

namespace IsimSaglik.Service.Abstract
{
    public interface IDeviceTokenService
    {
        Task CreateTokenAsync(Guid userId, DeviceTokenRequestDto dto);

        Task DeleteTokenAsync(Guid userId, string token);
    }
}