using Microsoft.EntityFrameworkCore;
using TravelPlanner.UserService.Models;

namespace TravelPlanner.UserService.Data;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<SharedPlanToken> SharedPlanTokens => Set<SharedPlanToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasDefaultValueSql("NEWID()");
            e.Property(x => x.Name).IsRequired().HasMaxLength(100);
            e.Property(x => x.Email).IsRequired().HasMaxLength(200);
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.PasswordHash).IsRequired();
            e.Property(x => x.Role).HasDefaultValue("user");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<SharedPlanToken>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasDefaultValueSql("NEWID()");
            e.Property(x => x.Token).IsRequired();
            e.Property(x => x.AccessType).IsRequired().HasMaxLength(10);
            e.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });
    }
}