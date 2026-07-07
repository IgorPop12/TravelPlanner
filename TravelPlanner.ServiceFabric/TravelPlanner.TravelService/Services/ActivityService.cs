using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TravelService.Data;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Models;
using System.Text.Json;
using System.Text;
using System.Net.Http.Headers;

namespace TravelPlanner.TravelService.Services;

public class ActivityService
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public ActivityService(TravelDbContext context, IMapper mapper,
        HttpClient httpClient, IConfiguration config)
    {
        _context = context;
        _mapper = mapper;
        _httpClient = httpClient;
        _config = config;
    }

    private async Task<bool> PlanBelongsToUser(Guid planId, Guid userId) =>
        await _context.TravelPlans.AnyAsync(p => p.Id == planId && p.UserId == userId);

    public async Task<List<ActivityDto>?> GetAllForPlanAsync(Guid planId, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId)) return null;

        var activities = await _context.Activities
            .Where(a => a.PlanId == planId)
            .OrderBy(a => a.Date)
            .ToListAsync();

        return _mapper.Map<List<ActivityDto>>(activities);
    }

    public async Task<(ActivityDto? Result, string? Error)> CreateAsync(
        Guid planId, CreateActivityDto dto, Guid userId, string authToken)
    {
        if (!await PlanBelongsToUser(planId, userId))
            return (null, "Plan nije pronađen.");

        var activity = new Activity
        {
            Id = Guid.NewGuid(),
            PlanId = planId,
            DestinationId = dto.DestinationId,
            Name = dto.Name,
            Date = dto.Date,
            Time = dto.Time,
            Location = dto.Location,
            Description = dto.Description,
            EstimatedCost = dto.EstimatedCost,
            Status = dto.Status
        };

        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();

        // Ako aktivnost ima procijenjeni trošak, dodaj ga automatski u ExpenseService
        if (dto.EstimatedCost > 0)
        {
            await CreateExpenseFromActivity(planId, activity, authToken);
        }

        return (_mapper.Map<ActivityDto>(activity), null);
    }

    private async Task CreateExpenseFromActivity(Guid planId, Activity activity, string authToken)
    {
        try
        {
            var expenseServiceUrl = _config["Services:ExpenseServiceUrl"];
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", authToken);

            var expense = new
            {
                name = $"Aktivnost: {activity.Name}",
                category = "other",
                amount = activity.EstimatedCost,
                date = activity.Date.ToString("yyyy-MM-dd"),
                description = $"Automatski dodan trošak za aktivnost: {activity.Name}"
            };

            var body = JsonSerializer.Serialize(expense);
            var content = new StringContent(body, Encoding.UTF8, "application/json");

            await _httpClient.PostAsync(
                $"{expenseServiceUrl}/api/travel-plans/{planId}/expenses", content);
        }
        catch
        {
            // Ne blokiramo kreiranje aktivnosti ako ExpenseService nije dostupan
        }
    }

    public async Task<(bool Success, string? Error)> UpdateAsync(
        Guid id, Guid planId, CreateActivityDto dto, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId))
            return (false, "Plan nije pronađen.");

        var activity = await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == id && a.PlanId == planId);

        if (activity == null) return (false, "Aktivnost nije pronađena.");

        activity.DestinationId = dto.DestinationId;
        activity.Name = dto.Name;
        activity.Date = dto.Date;
        activity.Time = dto.Time;
        activity.Location = dto.Location;
        activity.Description = dto.Description;
        activity.EstimatedCost = dto.EstimatedCost;
        activity.Status = dto.Status;

        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid planId, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId)) return false;

        var activity = await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == id && a.PlanId == planId);

        if (activity == null) return false;

        _context.Activities.Remove(activity);
        await _context.SaveChangesAsync();
        return true;
    }
}