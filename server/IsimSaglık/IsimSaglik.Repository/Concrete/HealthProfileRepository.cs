using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;

namespace IsimSaglik.Repository.Concrete
{
    public class HealthProfileRepository : RepositoryBase<HealthProfile>, IHealthProfileRepository
    {
        public HealthProfileRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public async Task <HealthProfile?> GetHealthProfileByUserIdAsync(Guid userId)
        {
            throw new NotImplementedException();
        }


        public override async Task<IEnumerable<HealthProfile>> GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public override async Task<HealthProfile?> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public override async Task CreateAsync(HealthProfile entity)
        {
            throw new NotImplementedException();
        }


        public override async Task UpdateAsync(HealthProfile entity)
        {
            throw new NotImplementedException();
        }

        public override async Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}