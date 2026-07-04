using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TravelService.Data;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Models;

namespace TravelPlanner.TravelService.Services;

public class TravelPlanService
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;

    public TravelPlanService(TravelDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<TravelPlanDto>> GetAllForUserAsync(Guid userId)
    {
        var plans = await _context.TravelPlans
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return _mapper.Map<List<TravelPlanDto>>(plans);
    }

    public async Task<TravelPlanDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var plan = await _context.TravelPlans
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        return plan == null ? null : _mapper.Map<TravelPlanDto>(plan);
    }

    public async Task<(TravelPlanDto? Result, string? Error)> CreateAsync(CreateTravelPlanDto dto, Guid userId)
    {
        if (dto.EndDate < dto.StartDate)
            return (null, "Krajnji datum ne može biti prije po?etnog datuma.");

        var plan = new TravelPlan
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Budget = dto.Budget,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.TravelPlans.Add(plan);
        await _context.SaveChangesAsync();

        return (_mapper.Map<TravelPlanDto>(plan), null);
    }

    public async Task<(bool Success, string? Error)> UpdateAsync(Guid id, CreateTravelPlanDto dto, Guid userId)
    {
        var plan = await _context.TravelPlans
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (plan == null) return (false, "Plan nije prona?en.");
        if (dto.EndDate < dto.StartDate) return (false, "Krajnji datum ne može biti prije po?etnog datuma.");

        plan.Name = dto.Name;
        plan.Description = dto.Description;
        plan.StartDate = dto.StartDate;
        plan.EndDate = dto.EndDate;
        plan.Budget = dto.Budget;
        plan.Notes = dto.Notes;

        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var plan = await _context.TravelPlans
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (plan == null) return false;

        _context.TravelPlans.Remove(plan); // kaskadno briše destinacije, aktivnosti, checklist
        await _context.SaveChangesAsync();
        return true;
    }
}