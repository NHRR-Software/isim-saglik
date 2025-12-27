using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/[controller]/[action]")]
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


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterCompany([FromBody] RegisterCompanyRequestDto dto)
        {
            await _serviceManager.Auth.RegisterCompanyAsync(dto);
            return CreatedResponse("Company registered successfully.");
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> LogIn([FromBody] LogInRequestDto dto) 
        {
            var result = await _serviceManager.Auth.LogInAsync(dto);
            return OkResponse(result, "Login successful.");
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDto dto)
        {
            var result = await _serviceManager.Auth.RefreshTokenAsync(dto);
            return OkResponse(result, "Token refreshed successfully.");
        }


        [HttpPost]
        public async Task<IActionResult> LogOut([FromBody] TokenRequestDto dto) 
        {
            await _serviceManager.Auth.LogOutAsync(dto);
            return OkResponse("Logout successful.");
        }
    }
}