using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface INotificationService
    {
        Task<NotificationResponseDto> CreateAsync(Guid userId, NotificationRequestDto dto);
        Task<IEnumerable<NotificationResponseDto>> GetAllByUserIdAsync(Guid userId);
    }
}