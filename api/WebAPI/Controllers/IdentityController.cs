

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using log4net;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebAPI;
using WebAPI.DB;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly ILogger _log;

        private SignInManager<IdentityUser> _signInManager;
        private UserManager<IdentityUser> _userManager;

        public IdentityController(SignInManager<IdentityUser> signinMgr,
        UserManager<IdentityUser> userMgr,
        ILogger<IdentityController> log)
        {
            this._log = log;
            this._signInManager = signinMgr;
            this._userManager = userMgr;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("current-user")]
        public async Task<User> GetCurrentUser() 
        {
            User user = new User();
            if(this.User is not null) {
                var email = this.User.FindFirstValue(ClaimTypes.Email);
                if(email is not null) {
                    var identityUser = await _userManager.FindByEmailAsync(email);

                    if(identityUser is not null) {
                        user.Email = identityUser.Email;
                        user.UserName = identityUser.UserName;
                    }
                }
            }
            return await Task.Run(() => user);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("external-login")]
        public IActionResult ExternalLogin(string provider, string returnUrl)
        {
            _log.LogInformation("In external-login... nothing going on here");
            _log.LogInformation(provider);
            _log.LogInformation(returnUrl);

            var redirectUrl = $"https://localhost:8080/api/identity/external-auth-callback?returnUrl={returnUrl}";
            AuthenticationProperties properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            properties.AllowRefresh = true;

            _log.LogInformation(properties.RedirectUri);
            foreach (KeyValuePair<string, string?> item in properties.Items)
            {
                _log.LogInformation("Item: [" + item.Key + "] " + item.Value);
            }

            _log.LogInformation("Executing Challenge");
            return Challenge(properties, provider);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("external-auth-callback")]
        public async Task<IActionResult> ExternalLoginCallback()
        {
            _log.LogInformation("In external-auth-callback...");

            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info is null)
            {
                _log.LogInformation("info was NULL");
                return await Task.Run(() => Ok());
            }

            var userName = info.Principal.FindFirst(ClaimTypes.Name)?.Value;
            var email = info.Principal.FindFirstValue(ClaimTypes.Email);

            _log.LogInformation("Username: " + userName);
            _log.LogInformation("Email: " + email);

            var signinResult = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, false, true);

            if (signinResult.Succeeded)
            {
                _log.LogInformation("Sign In Succeeded!");
                _log.LogInformation(this.User.ToString());
            }
            else
            {
                _log.LogCritical("signinResult not succeeded: " + signinResult.ToString());
            }

            if (email is not null && !email.IsNullOrEmpty())
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user is null)
                {
                    user = new User()
                    {
                        UserName = info.Principal.FindFirstValue(ClaimTypes.Email),
                        Email = info.Principal.FindFirstValue(ClaimTypes.Email)
                    };
                    await _userManager.CreateAsync(user);
                }

                await _userManager.AddLoginAsync(user, info);
                await _signInManager.SignInAsync(user, false);
                //var jwtResult = await jwtAuthManager.GenerateTokens(user, claims, DateTime.UtcNow);
            }

            var baseUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            return Redirect(baseUrl);
        }

    }

}
