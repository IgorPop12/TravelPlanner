using Microsoft.EntityFrameworkCore;
using TravelPlanner.ExpenseService.Models;

namespace TravelPlanner.ExpenseService.Data;

public class ExpenseDbContext : DbContext
{
    public ExpenseDbContext(DbContextOptions<ExpenseDbContext> options) : base(options) { }

    public DbSet<Expense> Expenses => Set<Expense>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Expense>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasDefaultValueSql("NEWID()");
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Category).IsRequired().HasMaxLength(50);
            e.Property(x => x.Amount).HasPrecision(18, 2);
            e.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });
    }
}