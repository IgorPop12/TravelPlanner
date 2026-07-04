using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TravelService.Data;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Models;

namespace TravelPlanner.TravelService.Services;

public class ActivityService
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;

    public ActivityService(TravelDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
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
        Guid planId, CreateActivityDto dto, Guid userId)
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

        return (_mapper.Map<ActivityDto>(activity), null);
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