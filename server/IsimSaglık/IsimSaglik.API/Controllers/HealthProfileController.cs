using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HealthProfileController : BaseController
    {
        private readonly IServiceManager _serviceManager;


        public HealthProfileController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        // REVIEW: Controller ve her bir action için küçük harflerle route tanımlaması yapalım. AuthController 'da örnek var.


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HealthProfileRequestDto dto)
        {
            await _serviceManager.HealthProfile.CreateAsync(UserId, dto);
            return CreatedResponse("Health profile created successfully.");
        }


        [HttpPut]
        public async Task<IActionResult> Update([FromBody] HealthProfileRequestDto dto)
        {
            await _serviceManager.HealthProfile.UpdateAsync(UserId, dto);
            return OkResponse("Health profile updated successfully.");
        }


        [HttpGet] 
        public async Task<IActionResult> GetHealthProfile()
        {
            var result = await _serviceManager.HealthProfile.GetByUserIdAsync(UserId);
            return Ok(result);
        }
    }
}