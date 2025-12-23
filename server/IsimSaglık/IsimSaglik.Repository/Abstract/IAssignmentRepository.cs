using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface IAssignmentRepository : IRepositoryBase<Assignment>
    {
        Task<IEnumerable<Assignment>> GetAssignmentsByUserAsync(Guid userId);
    }
}
