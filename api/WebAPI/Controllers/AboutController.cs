using System.Collections;
using log4net;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutController : ControllerBase
    {
        private readonly ILogger _log;

        private object aboutResponse = new { ApiName = ".NET Core 8.0 WebAPI", Version = "v1.0.0" };

        public AboutController(ILogger<AboutController> log) {
            _log = log;
        }

        [HttpGet]
        public IActionResult Get() {

            return Ok(aboutResponse);
        }

        [HttpGet("version")]
        public ContentResult GetVersion()
            => Content("v1.0.0");

    }
}