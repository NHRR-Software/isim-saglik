using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/device-tokens")]
    [ApiController]
    public sealed class DeviceTokenController : BaseController
    {
        private readonly IServiceManager _serviceManager;


        public DeviceTokenController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }


        // POST: api/device-tokens
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DeviceTokenRequestDto requestDto)
        {
            await _serviceManager.DeviceToken.CreateTokenAsync(UserId, requestDto);
            return OkResponse("Device token registered successfully.");
        }


        // DELETE: api/device-tokens/{token}
        [HttpDelete("{token}")]
        public async Task<IActionResult> Delete([FromRoute] string token)
        {
            await _serviceManager.DeviceToken.DeleteTokenAsync(UserId, token);
            return OkResponse("Device token removed successfully.");
        }
    }
}