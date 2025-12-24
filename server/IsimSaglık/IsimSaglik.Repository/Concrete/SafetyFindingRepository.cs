using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;

namespace IsimSaglik.Repository.Concrete
{
    public class SafetyFindingRepository : RepositoryBase<SafetyFinding>, ISafetyFindingRepository
    {
        public override async Task<IEnumerable<SafetyFinding>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public override async Task<SafetyFinding?> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<SafetyFinding>> GetByCompanyIdAsync(Guid companyId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<SafetyFinding>> GetByReporterIdAsync(Guid reporterId)
        {
            throw new NotImplementedException();
        }

        public override async Task CreateAsync(SafetyFinding entity)
        {
            throw new NotImplementedException();
        }

        public override async Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public override async Task UpdateAsync(SafetyFinding entity)
        {
            throw new NotImplementedException();
        }

    }
}