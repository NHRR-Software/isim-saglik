using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface INotificationService
    {
        Task CreateAsync(Guid userId, NotificationRequestDto dto);

        Task<IEnumerable<NotificationResponseDto>> GetAllByUserIdAsync(Guid userId);

        Task<NotificationResponseDto> MarkAsReadAsync(Guid userId, Guid id);

        Task DeleteAsync(Guid userId, Guid notificationId);
    }
}