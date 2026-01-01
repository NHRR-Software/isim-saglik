using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
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


        // GET: api/users/search?
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new BadRequestException("Email is required.", ErrorCodes.ValidationError);
            }

            var response = await _serviceManager.User.SearchUserAsync(email);
            return OkResponse(response, "User found successfully.");
        }
    }
}