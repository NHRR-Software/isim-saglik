using IsimSaglik.Entity.DTOs.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IsimSaglik.API.Controllers
{
    [Authorize]
    public abstract class BaseController : ControllerBase
    {
        protected Guid UserId
        {
            get
            {
                var identity = HttpContext?.User?.Identity as ClaimsIdentity;
                return Guid.Parse(identity?
                    .FindFirst(ClaimTypes.NameIdentifier)?
                    .Value!);
            }
        }


        protected IActionResult OkResponse<T>(T data, string? message = null)
        {
            return Ok(ApiResponseDto<T>.Success(data, 200, message));
        }


        protected IActionResult OkResponse(string? message = null)
        {
            return Ok(ApiResponseDto<object>.SuccessNoContent(200, message));
        }


        protected IActionResult CreatedResponse<T>(T data, string? message = null)
        {
            return StatusCode(201, ApiResponseDto<T>.Success(data, 201, message));
        }


        protected IActionResult NoContentResponse()
        {
            return NoContent();
        }
    }
}