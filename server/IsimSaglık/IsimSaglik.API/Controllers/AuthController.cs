using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public sealed class AuthController : BaseController
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IServiceManager _serviceManager;


        public AuthController(ILogger<AuthController> logger, IServiceManager serviceManager)
        {
            _logger = logger;
            _serviceManager = serviceManager;
        }


        // POST: api/auth/register-company
        [AllowAnonymous]
        [HttpPost("register-company")]
        public async Task<IActionResult> RegisterCompany([FromBody] RegisterCompanyRequestDto dto)
        {
            await _serviceManager.Auth.RegisterCompanyAsync(dto);
            return CreatedResponse("Company registered successfully.");
        }


        // POST: api/auth/register-with-invite
        [AllowAnonymous]
        [HttpPost("register-with-invite")]
        public async Task<IActionResult> RegisterWithInvite([FromBody] RegisterWithInviteRequestDto dto) 
        {
            await _serviceManager.Auth.RegisterWithInviteAsync(dto);
            return CreatedResponse("User registered successfully with invitation.");
        }


        // POST: api/auth/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody] LogInRequestDto dto) 
        {
            var result = await _serviceManager.Auth.LogInAsync(dto);
            return OkResponse(result, "Login successful.");
        }


        // POST: api/auth/refresh-token
        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto dto)
        {
            var result = await _serviceManager.Auth.RefreshTokenAsync(dto);
            return OkResponse(result, "Token refreshed successfully.");
        }


        // POST: api/auth/forgot-password
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest dto)
        {
            await _serviceManager.Auth.ForgotPasswordAsync(dto);
            return OkResponse("Password reset email sent successfully.");
        }


        // POST: api/auth/reset-password
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto dto)
        {
            await _serviceManager.Auth.ResetPasswordAsync(dto);
            return OkResponse("Password has been reset successfully. You can now login.");
        }


        // POST: api/auth/logout
        [HttpPost("logout")]
        public async Task<IActionResult> LogOut([FromBody] RefreshTokenRequestDto dto) 
        {
            await _serviceManager.Auth.LogOutAsync(dto);
            return OkResponse("Logout successful.");
        }
    }
}