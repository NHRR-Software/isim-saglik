using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace IsimSaglik.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected string UserId
        {
            get
            {
                var identity = HttpContext?.User?.Identity as ClaimsIdentity;
                return identity?
                    .FindFirst(ClaimTypes.NameIdentifier)?
                    .Value!;
            }
        }
    }
}