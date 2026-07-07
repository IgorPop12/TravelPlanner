using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Services;

namespace TravelPlanner.TravelService.Controllers;

[ApiController]
[Route("api/travel-plans/{planId}/activities")]
[Authorize]
public class ActivitiesController : ControllerBase
{
    private readonly ActivityService _service;

    public ActivitiesController(ActivityService service)
    {
        _service = service;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private string GetAuthToken() =>
        Request.Headers.Authorization.ToString().Replace("Bearer ", "");

    [HttpGet]
    public async Task<IActionResult> GetAll(Guid planId)
    {
        var result = await _service.GetAllForPlanAsync(planId, GetUserId());
        if (result == null) return NotFound(new { message = "Plan nije pronađen." });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid planId, [FromBody] CreateActivityDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (result, error) = await _service.CreateAsync(planId, dto, GetUserId(), GetAuthToken());
        if (error != null) return BadRequest(new { message = error });

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Guid planId, [FromBody] CreateActivityDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (success, error) = await _service.UpdateAsync(id, planId, dto, GetUserId());
        if (!success) return BadRequest(new { message = error });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, Guid planId)
    {
        var success = await _service.DeleteAsync(id, planId, GetUserId());
        if (!success) return NotFound();

        return NoContent();
    }
}