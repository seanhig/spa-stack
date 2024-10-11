using Microsoft.AspNetCore.Identity;

namespace WebAPI.Models;

public class User : IdentityUser
{
    public string? Provider { get; set; }
    public string? ProviderId { get; set; }
    public bool IsAdmin { get; set; }
}