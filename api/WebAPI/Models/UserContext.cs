using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models;

public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }

    public DbSet<User> UserItems { get; set; } = null!;
}