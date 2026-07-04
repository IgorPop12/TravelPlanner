using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TravelPlanner.TravelService.Data;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Models;

namespace TravelPlanner.TravelService.Services;

public class DestinationService
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;

    public DestinationService(TravelDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    private async Task<bool> PlanBelongsToUser(Guid planId, Guid userId) =>
        await _context.TravelPlans.AnyAsync(p => p.Id == planId && p.UserId == userId);

    public async Task<List<DestinationDto>?> GetAllForPlanAsync(Guid planId, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId)) return null;

        var destinations = await _context.Destinations
            .Where(d => d.PlanId == planId)
            .ToListAsync();

        return _mapper.Map<List<DestinationDto>>(destinations);
    }

    public async Task<(DestinationDto? Result, string? Error)> CreateAsync(
        Guid planId, CreateDestinationDto dto, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId))
            return (null, "Plan nije pronađen.");

        if (dto.DepartureDate < dto.ArrivalDate)
            return (null, "Datum odlaska ne može biti prije datuma dolaska.");

        var destination = new Destination
        {
            Id = Guid.NewGuid(),
            PlanId = planId,
            Name = dto.Name,
            Location = dto.Location,
            ArrivalDate = dto.ArrivalDate,
            DepartureDate = dto.DepartureDate,
            Description = dto.Description
        };

        _context.Destinations.Add(destination);
        await _context.SaveChangesAsync();

        return (_mapper.Map<DestinationDto>(destination), null);
    }

    public async Task<(bool Success, string? Error)> UpdateAsync(
        Guid id, Guid planId, CreateDestinationDto dto, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId))
            return (false, "Plan nije pronađen.");

        var destination = await _context.Destinations
            .FirstOrDefaultAsync(d => d.Id == id && d.PlanId == planId);

        if (destination == null) return (false, "Destinacija nije pronađena.");
        if (dto.DepartureDate < dto.ArrivalDate)
            return (false, "Datum odlaska ne može biti prije datuma dolaska.");

        destination.Name = dto.Name;
        destination.Location = dto.Location;
        destination.ArrivalDate = dto.ArrivalDate;
        destination.DepartureDate = dto.DepartureDate;
        destination.Description = dto.Description;

        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid planId, Guid userId)
    {
        if (!await PlanBelongsToUser(planId, userId)) return false;

        var destination = await _context.Destinations
            .FirstOrDefaultAsync(d => d.Id == id && d.PlanId == planId);

        if (destination == null) return false;

        _context.Destinations.Remove(destination);
        await _context.SaveChangesAsync();
        return true;
    }
}