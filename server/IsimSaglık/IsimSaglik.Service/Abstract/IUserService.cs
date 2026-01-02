using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface IUserService
    {
        Task<UserResponseDto> GetByIdAsync(Guid userId);

        Task<UserInfoResponseDto> SearchUserAsync(string email);

        Task<UserResponseDto> UpdateAsync(Guid userId, UserRequestDto dto);

        Task<IEnumerable<UserInfoResponseDto>> GetByCompanyIdAsync(Guid companyId);
    }
}