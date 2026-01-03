using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
using Microsoft.AspNetCore.Authorization;
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


        // PUT: api/users
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UserRequestDto dto)
        {
            var response = await _serviceManager.User.UpdateAsync(UserId, dto);
            return OkResponse(response, "User profile updated successfully.");
        }


        // GET: api/users/{id}
        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Company, Expert, Admin")]
        public async Task<IActionResult> GetUserDetails([FromRoute] Guid id)
        {
            var response = await _serviceManager.User.GetByIdAsync(id);
            return OkResponse(response, "User details retrieved successfully.");
        }


        // GET: api/users/company/{companyId}
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetByCompanyId([FromRoute] Guid companyId)
        {
            var response = await _serviceManager.User.GetByCompanyIdAsync(companyId);
            return OkResponse(response, "Company users retrieved successfully.");
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