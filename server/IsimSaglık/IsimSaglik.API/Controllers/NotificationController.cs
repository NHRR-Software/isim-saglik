using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    public class NotificationController : BaseController
    {
        private readonly IServiceManager _serviceManager;

        public NotificationController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }


        // GET: api/notifications
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _serviceManager.Notification.GetAllByUserIdAsync(UserId);
            return OkResponse(response, "Notifications retrieved successfully.");
        }


        // POST: api/notifications
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NotificationRequestDto requestDto)
        {
            await _serviceManager.Notification.CreateAsync(UserId, requestDto);
            return OkResponse("Notification created successfully.");
        }


        // PATCH: api/notifications/{id}/read
        [HttpPatch("{id:guid}/read")]
        public async Task<IActionResult> MarkAsRead([FromRoute] Guid id)
        {
            await _serviceManager.Notification.MarkAsReadAsync(UserId, id);
            return OkResponse("Notification marked as read.");
        }


        // DELETE: api/notifications/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _serviceManager.Notification.DeleteAsync(UserId, id);
            return OkResponse("Notification deleted successfully.");
        }
    }
}
