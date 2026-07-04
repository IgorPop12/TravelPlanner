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

    private class SharedPlanValidationResult
    {
        public Guid PlanId { get; set; }
        public string AccessType { get; set; } = string.Empty;
    }
}
