using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface ISafetyFindingRepository : IRepositoryBase<SafetyFinding>
    {
        Task<IEnumerable<SafetyFinding>?> GetByCompanyIdAsync(Guid companyId);
        Task<IEnumerable<SafetyFinding>?> GetByReporterIdAsync(Guid reporterId);
    }
}