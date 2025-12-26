using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface IAuthService
    {
        Task<TokenResponseDto> LogInAsync(LogInRequestDto dto);

        Task<TokenResponseDto> TokenAsync(TokenRequestDto dto);

        Task LogOutAsync(TokenRequestDto dto);
    }
}