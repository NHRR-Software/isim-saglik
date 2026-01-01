using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/safety-findings")]
    [ApiController]
    public sealed class SafetyFindingController : BaseController
    {
        private readonly IServiceManager _serviceManager;


        public SafetyFindingController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }


        // GET: api/safety-findings
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _serviceManager.SafetyFinding.GetAllByUserIdAsync(UserId);
            return OkResponse(response, "Safety findings retrieved successfully.");
        }


        // POST: api/safety-findings
        [HttpPost]
        [Authorize(Roles = "Expert")]
        public async Task<IActionResult> Create([FromBody] SafetyFindingRequestDto requestDto)
        {
            var response = await _serviceManager.SafetyFinding.CreateAsync(UserId, requestDto);
            return OkResponse(response, "Safety finding reported successfully.");
        }


        // PATCH: api/safety-findings/{id}/complete
        [HttpPatch("{id:guid}/complete")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> MarkAsCompleted([FromRoute] Guid id)
        {
            await _serviceManager.SafetyFinding.MarkAsCompleted(UserId, id);
            return OkResponse("Safety finding marked as completed.");
        }


        // DELETE: api/safety-findings/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _serviceManager.SafetyFinding.DeleteAsync(UserId, id);
            return OkResponse("Safety finding deleted successfully.");
        }
    }
}