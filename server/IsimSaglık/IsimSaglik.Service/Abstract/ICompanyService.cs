using IsimSaglik.Entity.DTOs.Request;

namespace IsimSaglik.Service.Abstract
{
    public interface ICompanyService
    {
        Task InviteUserAsync(Guid companyId, InviteUserRequestDto dto);
    }
}