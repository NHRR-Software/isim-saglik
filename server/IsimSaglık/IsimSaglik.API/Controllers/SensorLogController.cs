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
            var analysisResults = await _serviceManager.SensorLog.CreateAsync(UserId, dto);

            if (analysisResults != null && analysisResults.Any())
            {
                foreach (var result in analysisResults)
                {
                    await _serviceManager.Notification.CreateAsync(UserId, new NotificationRequestDto
                    {
                        Title = result.Title,
                        Description = result.Description,
                        Type = result.Type
                    });
                }
            }

            return OkResponse("Sensor data recorded and analyzed successfully.");
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