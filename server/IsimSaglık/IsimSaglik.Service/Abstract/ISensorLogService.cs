using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface ISensorLogService
    {
        Task<IEnumerable<AnalysisResult>> CreateAsync(Guid userId, SensorLogRequestDto dto);
        Task<SensorLogResponseDto> GetByUserIdAsync(Guid userId);
    }
}