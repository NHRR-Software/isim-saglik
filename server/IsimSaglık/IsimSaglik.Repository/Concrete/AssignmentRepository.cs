using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;

namespace IsimSaglik.Repository.Concrete
{
    public class AssignmentRepository : RepositoryBase<Assignment>, IAssignmentRepository
    {
        public AssignmentRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public async Task<IEnumerable<Assignment>> GetAssignmentsByUserIdAsync(Guid userId)
        {
            throw new NotImplementedException();
        }


        public override async Task<IEnumerable<Assignment>> GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public override async Task<Assignment?> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public override async Task CreateAsync(Assignment entity)
        {
            throw new NotImplementedException();
        }

        public override async Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public override async Task UpdateAsync(Assignment entity)
        {
            throw new NotImplementedException();
        }
    }
}