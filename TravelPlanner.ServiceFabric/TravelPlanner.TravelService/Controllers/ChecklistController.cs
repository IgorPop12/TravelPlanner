using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Services;

namespace TravelPlanner.TravelService.Controllers;

[ApiController]
[Route("api/travel-plans/{planId}/checklist-items")]
[Authorize]
public class ChecklistController : ControllerBase
{
    private readonly ChecklistService _service;

    public ChecklistController(ChecklistService service)
    {
        _service = service;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll(Guid planId)
    {
        var result = await _service.GetAllForPlanAsync(planId, GetUserId());
        if (result == null) return NotFound(new { message = "Plan nije pronađen." });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid planId, [FromBody] CreateChecklistItemDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (result, error) = await _service.CreateAsync(planId, dto, GetUserId());
        if (error != null) return BadRequest(new { message = error });

        return Ok(result);
    }

    // PATCH - samo mijenja IsCompleted status
    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(Guid id, Guid planId)
    {
        var success = await _service.ToggleAsync(id, planId, GetUserId());
        if (!success) return NotFound();

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