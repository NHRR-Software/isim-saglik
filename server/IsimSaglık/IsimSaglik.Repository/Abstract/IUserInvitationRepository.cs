using IsimSaglik.Entity.Models;

namespace IsimSaglik.Repository.Abstract
{
    public interface IUserInvitationRepository : IRepositoryBase<UserInvitation>
    {
        Task<UserInvitation?> GetInvitationByEmailAsync(string email);

        Task<IEnumerable<UserInvitation>> GetByCompanyIdAsync(Guid companyId);
    }
}