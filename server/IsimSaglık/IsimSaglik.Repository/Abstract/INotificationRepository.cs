using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface INotificationRepository : IRepositoryBase<Notification>
    {
        Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(Guid userId);
    }
}