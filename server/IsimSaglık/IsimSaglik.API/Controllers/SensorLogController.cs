using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/sensor-logs")]
    [ApiController]
    public class SensorLogController : BaseController
    {
        private readonly IServiceManager _serviceManager;


        public SensorLogController(
            IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }


        // POST: api/sensor-logs
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SensorLogRequestDto dto)
        {
            await _serviceManager.SensorLog.CreateAsync(UserId, dto);
            return OkResponse("Sensor log created successfully.");
        }


        // POST: api/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var response = await _serviceManager.SensorLog.GetByUserIdAsync(UserId);
            return OkResponse(response, "Sensor log retrieved successfully.");
        }


        // POST: api/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser([FromRoute] Guid userId)
        {
            var response = await _serviceManager.SensorLog.GetByUserIdAsync(userId);
            return OkResponse(response, "User sensor log retrieved successfully.");
        }
    }
}