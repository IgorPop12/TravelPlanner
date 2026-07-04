using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.ExpenseService.DTOs;
using ExpenseServiceClass = TravelPlanner.ExpenseService.Services.ExpenseService;


namespace TravelPlanner.ExpenseService.Controllers;

[ApiController]
[Route("api/travel-plans/{planId}/expenses")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private readonly ExpenseServiceClass _service;

    public ExpensesController(ExpenseServiceClass service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(Guid planId)
    {
        var result = await _service.GetAllForPlanAsync(planId);
        return Ok(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(Guid planId)
    {
        var authHeader = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        var summary = await _service.GetBudgetSummaryAsync(planId, authHeader);

        if (summary == null) return NotFound(new { message = "Plan nije pronađen." });
        return Ok(summary);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid planId, [FromBody] CreateExpenseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _service.CreateAsync(planId, dto);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Guid planId, [FromBody] CreateExpenseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var success = await _service.UpdateAsync(id, planId, dto);
        if (!success) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, Guid planId)
    {
        var success = await _service.DeleteAsync(id, planId);
        if (!success) return NotFound();

        return NoContent();
    }
}