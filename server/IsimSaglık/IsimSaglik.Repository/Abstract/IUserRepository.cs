using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        Task<User?> GetByEmailAsync(string email);

        Task<IEnumerable<User>?> GetByCompanyIdAsync(Guid companyId);
    }
}