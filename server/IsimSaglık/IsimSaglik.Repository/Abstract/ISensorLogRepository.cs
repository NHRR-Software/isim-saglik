using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface ISensorLogRepository : IRepositoryBase<SensorLog>
    {
        Task<SensorLog?> GetLatestByUserIdAsync(Guid userId);

        Task<IEnumerable<SensorLog>?> GetHistoryByUserIdAsync(Guid userId, DateTime startTime, DateTime endTime);
    }
}