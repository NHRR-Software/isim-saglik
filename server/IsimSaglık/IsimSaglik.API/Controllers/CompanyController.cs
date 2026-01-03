using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/companies")]
    [ApiController]
    public class CompanyController : BaseController
    {
        private readonly ILogger<CompanyController> _logger;
        private readonly IServiceManager _serviceManager;


        public CompanyController(ILogger<CompanyController> logger, IServiceManager serviceManager)
        {
            _logger = logger;
            _serviceManager = serviceManager;
        }


        // POST: api/companies/invite-user
        [HttpPost("invite-user")]
        public async Task<IActionResult> InviteUser([FromBody] InviteUserRequestDto dto) 
        {
            await _serviceManager.Company.InviteUserAsync(UserId, dto);
            return OkResponse("User invited successfully.");
        }
    }
}