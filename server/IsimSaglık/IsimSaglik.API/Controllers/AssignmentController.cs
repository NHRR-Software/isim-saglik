using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Service.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace IsimSaglik.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AssignmentController : BaseController
    {
        private readonly IServiceManager _serviceManager;

        public AssignmentController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _serviceManager.Assignment.GetAllByUserIdAsync(UserId);
            return OkResponse(response,"Assignments retrieved successfully.");
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AssignmentRequestDto requestDto)
        {
           var response = await _serviceManager.Assignment.CreateAsync(UserId, requestDto);

            return OkResponse(response,"Assignment created successfully.");
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] AssignmentRequestDto requestDto)
        {
            var response = await _serviceManager.Assignment.UpdateAsync(UserId, id, requestDto);

            return OkResponse(response, "Assignment updated successfully.");
        }


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _serviceManager.Assignment.DeleteAsync(UserId, id);
            return OkResponse("Assignment deleted successfully.");
        }


    }
}
