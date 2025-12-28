using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface IAuthService
    {
        Task RegisterCompanyAsync(RegisterCompanyRequestDto dto);

        Task RegisterWithInviteAsync(RegisterWithInviteRequestDto dto);

        Task<TokenResponseDto> LogInAsync(LogInRequestDto dto);

        Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto dto);

        Task ForgotPasswordAsync(ForgotPasswordRequest dto);

        Task ResetPasswordAsync(ResetPasswordRequestDto dto);

        Task LogOutAsync(RefreshTokenRequestDto dto);
    }
}