using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;

namespace IsimSaglik.Repository.Concrete
{
    public class NotificationRepository : RepositoryBase<Notification>, INotificationRepository
    {
        public NotificationRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override Task<IEnumerable<Notification>> GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public override async Task<Notification?> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public async Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(Guid userId)
        {
            throw new NotImplementedException();
        }


        public override async Task CreateAsync(Notification entity)
        {
            throw new NotImplementedException();
        }


        public override async Task UpdateAsync(Notification entity)
        {
            throw new NotImplementedException();
        }


        public override async Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}