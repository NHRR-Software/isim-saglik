using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IServiceManager _serviceManager;


        public AuthController(ILogger<AuthController> logger, IServiceManager serviceManager)
        {
            _logger = logger;
            _serviceManager = serviceManager;
        }


        public async Task<IActionResult> LogInEmail([FromBody] LogInEmailRequestDto dto) 
        {
            
        }
    }
}