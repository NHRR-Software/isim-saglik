using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/health-profiles")]  
    [ApiController]
    public class HealthProfileController : BaseController
    {
        private readonly IServiceManager _serviceManager;


        public HealthProfileController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }


        // POST: api/health-profiles
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HealthProfileRequestDto dto)
        {
            await _serviceManager.HealthProfile.CreateAsync(UserId, dto);
            return CreatedResponse("Health profile created successfully.");
        }


        // PUT: api/health-profiles
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] HealthProfileRequestDto dto)
        {
            await _serviceManager.HealthProfile.UpdateAsync(UserId, dto);
            return OkResponse("Health profile updated successfully.");
        }


        // GET: api/health-profiles
        [HttpGet] 
        public async Task<IActionResult> Get()
        {
            var result = await _serviceManager.HealthProfile.GetByUserIdAsync(UserId);
            return OkResponse(result, "Health profile retrieved successfully.");
        }
    }
}