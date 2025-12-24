using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface IHealthProfileRepository: IRepositoryBase<HealthProfile>
    {
        Task<HealthProfile?> GetHealthProfileByUserIdAsync(Guid userId);
    }
}