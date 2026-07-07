using Microsoft.AspNetCore.Mvc;
using TravelPlanner.TravelService.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using TravelPlanner.TravelService.DTOs;
using System.Text.Json;
using System.Text;

namespace TravelPlanner.TravelService.Controllers;

[ApiController]
[Route("api/shared-access")]
public class SharedAccessController : ControllerBase
{
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;


    public SharedAccessController(TravelDbContext context, IMapper mapper,
        IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _mapper = mapper;
        _config = config;
        _httpClient = httpClientFactory.CreateClient();
    }

    private async Task<(Guid PlanId, string AccessType)?> ValidateShareToken(string token)
    {
        var userServiceUrl = _config["Services:UserServiceUrl"];
        var body = JsonSerializer.Serialize(new { token });
        var content = new StringContent(body, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(
            $"{userServiceUrl}/api/shared-plans/validate", content);

        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadFromJsonAsync<SharedPlanValidationResult>();
        if (json == null) return null;

        return (json.PlanId, json.AccessType);
    }

    // GET endpoints
    [HttpGet("plans/{planId}")]
    public async Task<IActionResult> GetPlan(Guid planId, [FromQuery] string token)
    {
        var result = await ValidateShareToken(token);
        if (result == null) return Unauthorized();
        if (result.Value.PlanId != planId) return Unauthorized();

        var plan = await _context.TravelPlans.FindAsync(planId);
        if (plan == null) return NotFound();

        return Ok(_mapper.Map<TravelPlanDto>(plan));
    }

    [HttpGet("plans/{planId}/destinations")]
    public async Task<IActionResult> GetDestinations(Guid planId, [FromQuery] string token)
    {
        var result = await ValidateShareToken(token);
        if (result == null) return Unauthorized();
        if (result.Value.PlanId != planId) return Unauthorized();

        var destinations = await _context.Destinations
            .Where(d => d.PlanId == planId).ToListAsync();

        return Ok(_mapper.Map<List<DestinationDto>>(destinations));
    }

    [HttpGet("plans/{planId}/activities")]
    public async Task<IActionResult> GetActivities(Guid planId, [FromQuery] string token)
    {
        var result = await ValidateShareToken(token);
        if (result == null) return Unauthorized();
        if (result.Value.PlanId != planId) return Unauthorized();

        var activities = await _context.Activities
            .Where(a => a.PlanId == planId)
            .OrderBy(a => a.Date).ToListAsync();

        return Ok(_mapper.Map<List<ActivityDto>>(activities));
    }

    [HttpGet("plans/{planId}/checklist-items")]
    public async Task<IActionResult> GetChecklist(Guid planId, [FromQuery] string token)
    {
        var result = await ValidateShareToken(token);
        if (result == null) return Unauthorized();
        if (result.Value.PlanId != planId) return Unauthorized();

        var items = await _context.ChecklistItems
            .Where(c => c.PlanId == planId).ToListAsync();

        return Ok(_mapper.Map<List<ChecklistItemDto>>(items));
    }

    // EDIT endpoints
    [HttpPost("plans/{planId}/destinations")]
    public async Task<IActionResult> CreateDestination(
        Guid planId, [FromQuery] string token, [FromBody] CreateDestinationDto dto)
    {
        var result = await ValidateShareToken(token);
        if (result == null || result.Value.PlanId != planId) return Unauthorized();
        if (result.Value.AccessType != "EDIT") return Forbid();

        var destination = new TravelPlanner.TravelService.Models.Destination
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

        return Ok(_mapper.Map<DestinationDto>(destination));
    }

    [HttpDelete("plans/{planId}/destinations/{id}")]
    public async Task<IActionResult> DeleteDestination(
        Guid planId, Guid id, [FromQuery] string token)
    {
        var result = await ValidateShareToken(token);
        if (result == null || result.Value.PlanId != planId) return Unauthorized();
        if (result.Value.AccessType != "EDIT") return Forbid();

        var destination = await _context.Destinations
            .FirstOrDefaultAsync(d => d.Id == id && d.PlanId == planId);

        if (destination == null) return NotFound();

        _context.Destinations.Remove(destination);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("plans/{planId}/activities")]
    public async Task<IActionResult> CreateActivity(
        Guid planId, [FromQuery] string token, [FromBody] CreateActivityDto dto)
    {
        var result = await ValidateShareToken(token);
        if (result == null || result.Value.PlanId != planId) return Unauthorized();
        if (result.Value.AccessType != "EDIT") return Forbid();

        var activity = new TravelPlanner.TravelService.Models.Activity
        {
            Id = Guid.NewGuid(),
            PlanId = planId,
            Name = dto.Name,
            Date = dto.Date,
            Time = dto.Time,
            Location = dto.Location,
            Description = dto.Description,
            EstimatedCost = dto.EstimatedCost,
            Status = dto.Status,
            DestinationId = dto.DestinationId
        };

        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<ActivityDto>(activity));
    }

    [HttpDelete("plans/{planId}/activities/{id}")]
    public async Task<IActionResult> DeleteActivity(
        Guid planId, Guid id, [FromQuery] string token)
    {
        var result = await ValidateShareToken(token);
        if (result == null || result.Value.PlanId != planId) return Unauthorized();
        if (result.Value.AccessType != "EDIT") return Forbid();

        var activity = await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == id && a.PlanId == planId);

        if (activity == null) return NotFound();

        _context.Activities.Remove(activity);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("plans/{planId}/checklist-items")]
    public async Task<IActionResult> CreateChecklistItem(
        Guid planId, [FromQuery] string token, [FromBody] CreateChecklistItemDto dto)
    {
        var result = await ValidateShareToken(token);
        if (result == null || result.Value.PlanId != planId) return Unauthorized();
        if (result.Value.AccessType != "EDIT") return Forbid();

        var item = new TravelPlanner.TravelService.Models.ChecklistItem
        {
            Id = Guid.NewGuid(),
            PlanId = planId,
            Name = dto.Name,
            IsCompleted = false
        };

        _context.ChecklistItems.Add(item);
        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<ChecklistItemDto>(item));
    }

    [HttpPatch("plans/{planId}/checklist-items/{id}/toggle")]
    public async Task<IActionResult> ToggleChecklistItem(
        Guid planId, Guid id, [FromQuery] string token)
    {
        var result = await ValidateShareToken(token);
        if (result == null || result.Value.PlanId != planId) return Unauthorized();
        if (result.Value.AccessType != "EDIT") return Forbid();

        var item = await _context.ChecklistItems
            .FirstOrDefaultAsync(c => c.Id == id && c.PlanId == planId);

        if (item == null) return NotFound();

        item.IsCompleted = !item.IsCompleted;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private class SharedPlanValidationResult
    {
        public Guid PlanId { get; set; }
        public string AccessType { get; set; } = string.Empty;
    }
}
