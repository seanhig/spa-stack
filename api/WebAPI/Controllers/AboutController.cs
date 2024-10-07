using System.Collections;
using log4net;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutController : ControllerBase
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(AboutController));

        private object aboutResponse = new { ApiName = "This is WebAPI!", Version = "v1.0.0" };

        [HttpGet]
        public IActionResult Get() {

            return Ok(aboutResponse);
        }

        [HttpGet("version")]
        public ContentResult GetVersion()
            => Content("v1.0.0");

    }
}