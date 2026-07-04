using Microsoft.EntityFrameworkCore;
using TravelPlanner.TravelService.Models;

namespace TravelPlanner.TravelService.Data;

public class TravelDbContext : DbContext
{
    public TravelDbContext(DbContextOptions<TravelDbContext> options) : base(options) { }

    public DbSet<TravelPlan> TravelPlans => Set<TravelPlan>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<ChecklistItem> ChecklistItems => Set<ChecklistItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TravelPlan>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasDefaultValueSql("NEWID()");
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Budget).HasPrecision(18, 2);
            e.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.HasMany(x => x.Destinations).WithOne(x => x.Plan)
                .HasForeignKey(x => x.PlanId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Activities).WithOne(x => x.Plan)
                .HasForeignKey(x => x.PlanId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.ChecklistItems).WithOne(x => x.Plan)
                .HasForeignKey(x => x.PlanId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Destination>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasDefaultValueSql("NEWID()");
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<Activity>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasDefaultValueSql("NEWID()");
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.EstimatedCost).HasPrecision(18, 2);
            e.Property(x => x.Status).HasDefaultValue("planned");
        });

        modelBuilder.Entity<ChecklistItem>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasDefaultValueSql("NEWID()");
            e.Property(x => x.Name).IsRequired().HasMaxLength(300);
        });
    }
}