using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface IHealthProfileService
    {
        Task CreateAsync(Guid userId, HealthProfileRequestDto dto);
        Task UpdateAsync(Guid userId, HealthProfileRequestDto dto);
        Task<HealthProfileResponseDto> GetByUserIdAsync(Guid userId);
    }
}