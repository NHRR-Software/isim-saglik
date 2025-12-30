using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public sealed class UserController : BaseController
    {
        private readonly ILogger<UserController> _logger;
        private readonly IServiceManager _serviceManager;


        public UserController(ILogger<UserController> logger, IServiceManager serviceManager)
        {
            _logger = logger;
            _serviceManager = serviceManager;
        }


        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var response = await _serviceManager.User.GetByIdAsync(UserId);
            return OkResponse(response, "User profile retrieved successfully.");
        }
    }
}