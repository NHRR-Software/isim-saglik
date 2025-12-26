using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
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
        public async Task<IActionResult> LogIn([FromBody] LogInRequestDto dto) 
        {
            var result = await _serviceManager.Auth.LogInAsync(dto);
            return OkResponse(result, "Login successful.");
        }


        [HttpPost]
        public async Task<IActionResult> Token([FromBody] TokenRequestDto dto)
        {
            var result = await _serviceManager.Auth.TokenAsync(dto);
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