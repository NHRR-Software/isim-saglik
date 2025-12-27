using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface IAuthService
    {
        Task RegisterCompanyAsync(RegisterCompanyRequestDto dto);

        Task<TokenResponseDto> LogInAsync(LogInRequestDto dto);

        Task<TokenResponseDto> RefreshTokenAsync(TokenRequestDto dto);

        Task LogOutAsync(TokenRequestDto dto);
    }
}