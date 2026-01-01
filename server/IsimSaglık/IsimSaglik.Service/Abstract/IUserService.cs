using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface IUserService
    {
        Task<UserResponseDto> GetByIdAsync(Guid userId);

        Task<UserInfoResponseDto> SearchUserAsync(string email);
    }
}