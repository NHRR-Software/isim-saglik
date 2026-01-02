using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface ISafetyFindingService
    {
        Task<SafetyFindingResponseDto> CreateAsync(Guid userId, SafetyFindingRequestDto dto);

        Task MarkAsCompleted(Guid userId, Guid safetyFindingId);

        Task DeleteAsync(Guid userId, Guid safetyFindingId);

        Task<IEnumerable<SafetyFindingResponseDto>> GetAllByUserIdAsync(Guid userId);
    }
}