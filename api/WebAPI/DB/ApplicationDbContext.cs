using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
        base(options)
    { }

/*
**      Change the Identity Table Names
*/
/*     protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityUser>(b =>
        {
            b.ToTable("MyUsers");
        });

        modelBuilder.Entity<IdentityUserClaim<string>>(b =>
        {
            b.ToTable("MyUserClaims");
        });

        modelBuilder.Entity<IdentityUserLogin<string>>(b =>
        {
            b.ToTable("MyUserLogins");
        });

        modelBuilder.Entity<IdentityUserToken<string>>(b =>
        {
            b.ToTable("MyUserTokens");
        });

        modelBuilder.Entity<IdentityRole>(b =>
        {
            b.ToTable("MyRoles");
        });

        modelBuilder.Entity<IdentityRoleClaim<string>>(b =>
        {
            b.ToTable("MyRoleClaims");
        });

        modelBuilder.Entity<IdentityUserRole<string>>(b =>
        {
            b.ToTable("MyUserRoles");
        });
    } */

}