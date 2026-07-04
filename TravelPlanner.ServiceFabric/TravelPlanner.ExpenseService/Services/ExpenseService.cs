using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.ExpenseService.Data;
using TravelPlanner.ExpenseService.DTOs;
using TravelPlanner.ExpenseService.Models;

namespace TravelPlanner.ExpenseService.Services;

public class ExpenseService
{
    private readonly ExpenseDbContext _context;
    private readonly IMapper _mapper;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public ExpenseService(ExpenseDbContext context, IMapper mapper,
        HttpClient httpClient, IConfiguration config)
    {
        _context = context;
        _mapper = mapper;
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<List<ExpenseDto>> GetAllForPlanAsync(Guid planId)
    {
        var expenses = await _context.Expenses
            .Where(e => e.PlanId == planId)
            .OrderByDescending(e => e.Date)
            .ToListAsync();

        return _mapper.Map<List<ExpenseDto>>(expenses);
    }

    public async Task<ExpenseDto> CreateAsync(Guid planId, CreateExpenseDto dto)
    {
        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            PlanId = planId,
            Name = dto.Name,
            Category = dto.Category,
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return _mapper.Map<ExpenseDto>(expense);
    }

    public async Task<bool> UpdateAsync(Guid id, Guid planId, CreateExpenseDto dto)
    {
        var expense = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && e.PlanId == planId);

        if (expense == null) return false;

        expense.Name = dto.Name;
        expense.Category = dto.Category;
        expense.Amount = dto.Amount;
        expense.Date = dto.Date;
        expense.Description = dto.Description;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid planId)
    {
        var expense = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && e.PlanId == planId);

        if (expense == null) return false;

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<BudgetSummaryDto?> GetBudgetSummaryAsync(Guid planId, string authToken)
    {
        // Pozovi TravelService da dobiješ planirani budžet
        var travelServiceUrl = _config["Services:TravelServiceUrl"];
        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", authToken);

        var response = await _httpClient.GetAsync($"{travelServiceUrl}/api/travel-plans/{planId}");
        if (!response.IsSuccessStatusCode) return null;

        var plan = await response.Content.ReadFromJsonAsync<TravelPlanResponse>();
        if (plan == null) return null;

        var expenses = await _context.Expenses.Where(e => e.PlanId == planId).ToListAsync();
        var totalSpent = expenses.Sum(e => e.Amount);

        return new BudgetSummaryDto
        {
            PlannedBudget = plan.Budget,
            TotalSpent = totalSpent,
            Remaining = plan.Budget - totalSpent,
            ByCategory = expenses
                .GroupBy(e => e.Category)
                .Select(g => new CategoryBreakdownDto { Category = g.Key, Total = g.Sum(e => e.Amount) })
                .ToList()
        };
    }

    private class TravelPlanResponse
    {
        public decimal Budget { get; set; }
    }
}