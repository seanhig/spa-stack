using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.DB;

public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }

    public DbSet<User> UserItems { get; set; } = null!;
}