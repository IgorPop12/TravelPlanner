using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Services;

namespace TravelPlanner.TravelService.Controllers;

[ApiController]
[Route("api/travel-plans")]
[Authorize]
public class TravelPlansController : ControllerBase
{
    private readonly TravelPlanService _service;

    public TravelPlansController(TravelPlanService service)
    {
        _service = service;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var plans = await _service.GetAllForUserAsync(GetUserId());
        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var plan = await _service.GetByIdAsync(id, GetUserId());
        if (plan == null) return NotFound();
        return Ok(plan);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTravelPlanDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (result, error) = await _service.CreateAsync(dto, GetUserId());
        if (error != null) return BadRequest(new { message = error });

        return CreatedAtAction(nameof(GetById), new { id = result!.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateTravelPlanDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (success, error) = await _service.UpdateAsync(id, dto, GetUserId());
        if (!success) return BadRequest(new { message = error });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _service.DeleteAsync(id, GetUserId());
        if (!success) return NotFound();

        return NoContent();
    }
}