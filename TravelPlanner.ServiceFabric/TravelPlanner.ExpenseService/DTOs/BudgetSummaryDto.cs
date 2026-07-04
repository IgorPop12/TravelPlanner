namespace TravelPlanner.ExpenseService.DTOs;

public class BudgetSummaryDto
{
    public decimal PlannedBudget { get; set; }
    public decimal TotalSpent { get; set; }
    public decimal Remaining { get; set; }
    public List<CategoryBreakdownDto> ByCategory { get; set; } = new();
}

public class CategoryBreakdownDto
{
    public string Category { get; set; } = string.Empty;
    public decimal Total { get; set; }
}
