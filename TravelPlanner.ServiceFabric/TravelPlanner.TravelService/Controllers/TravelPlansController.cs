using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using TravelPlanner.TravelService.Data;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Services;

namespace TravelPlanner.TravelService.Controllers;

[ApiController]
[Route("api/travel-plans")]
[Authorize]
public class TravelPlansController : ControllerBase
{
    private readonly TravelPlanService _service;
    private readonly TravelDbContext _context;
    private readonly IMapper _mapper;

    public TravelPlansController(TravelPlanService service,
        TravelDbContext context, IMapper mapper)
    {
        _service = service;
        _context = context;
        _mapper = mapper;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool IsAdmin() =>
        User.IsInRole("admin");

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var plans = await _service.GetAllForUserAsync(GetUserId());
        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        // Admin može vidjeti bilo koji plan
        if (IsAdmin())
        {
            var plan = await _context.TravelPlans.FindAsync(id);
            if (plan == null) return NotFound();
            return Ok(_mapper.Map<TravelPlanDto>(plan));
        }

        var result = await _service.GetByIdAsync(id, GetUserId());
        if (result == null) return NotFound();
        return Ok(result);
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
        // Admin može obrisati bilo koji plan
        if (IsAdmin())
        {
            var plan = await _context.TravelPlans.FindAsync(id);
            if (plan == null) return NotFound();

            _context.TravelPlans.Remove(plan);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        var success = await _service.DeleteAsync(id, GetUserId());
        if (!success) return NotFound();

        return NoContent();
    }

    [HttpGet("all")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAllPlans()
    {
        var plans = await _context.TravelPlans.ToListAsync();
        return Ok(_mapper.Map<List<TravelPlanDto>>(plans));
    }

    // Interni endpoint — planovi po userId (koristi UsersController za brisanje)
    [HttpGet("by-user/{userId}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var plans = await _context.TravelPlans
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return Ok(_mapper.Map<List<TravelPlanDto>>(plans));
    }
}