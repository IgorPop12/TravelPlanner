using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TravelService.Data;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Models;

namespace TravelPlanner.TravelService.Services;

public class ChecklistService
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;

    public ChecklistService(TravelDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    private async Task<bool> PlanBelongsToUser(Guid planId, Guid userId) =>
        await _context.TravelPlans.AnyAsync(p => p.Id == planId && p.UserId == userId);

    public async Task<List<ChecklistItemDto>?> GetAllForPlanAsync(Guid planId, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId)) return null;

        var items = await _context.ChecklistItems
            .Where(c => c.PlanId == planId)
            .ToListAsync();

        return _mapper.Map<List<ChecklistItemDto>>(items);
    }

    public async Task<(ChecklistItemDto? Result, string? Error)> CreateAsync(
        Guid planId, CreateChecklistItemDto dto, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId))
            return (null, "Plan nije pronađen.");

        var item = new ChecklistItem
        {
            Id = Guid.NewGuid(),
            PlanId = planId,
            Name = dto.Name,
            IsCompleted = false
        };

        _context.ChecklistItems.Add(item);
        await _context.SaveChangesAsync();

        return (_mapper.Map<ChecklistItemDto>(item), null);
    }

    public async Task<bool> ToggleAsync(Guid id, Guid planId, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId)) return false;

        var item = await _context.ChecklistItems
            .FirstOrDefaultAsync(c => c.Id == id && c.PlanId == planId);

        if (item == null) return false;

        item.IsCompleted = !item.IsCompleted;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid planId, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId)) return false;

        var item = await _context.ChecklistItems
            .FirstOrDefaultAsync(c => c.Id == id && c.PlanId == planId);

        if (item == null) return false;

        _context.ChecklistItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}