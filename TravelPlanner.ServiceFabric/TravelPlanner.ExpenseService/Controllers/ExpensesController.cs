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

    private string GetAuthToken() =>
        Request.Headers.Authorization.ToString().Replace("Bearer ", "");

    [HttpGet]
    public async Task<IActionResult> GetAll(Guid planId)
    {
        if (!await _service.PlanBelongsToUser(planId, GetAuthToken()))
            return Forbid();

        var result = await _service.GetAllForPlanAsync(planId);
        return Ok(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(Guid planId)
    {
        var authToken = GetAuthToken();

        if (!await _service.PlanBelongsToUser(planId, authToken))
            return Forbid();

        var summary = await _service.GetBudgetSummaryAsync(planId, authToken);
        if (summary == null) return NotFound(new { message = "Plan nije pronađen." });
        return Ok(summary);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid planId, [FromBody] CreateExpenseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!await _service.PlanBelongsToUser(planId, GetAuthToken()))
            return Forbid();

        var result = await _service.CreateAsync(planId, dto);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Guid planId, [FromBody] CreateExpenseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!await _service.PlanBelongsToUser(planId, GetAuthToken()))
            return Forbid();

        var success = await _service.UpdateAsync(id, planId, dto);
        if (!success) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, Guid planId)
    {
        if (!await _service.PlanBelongsToUser(planId, GetAuthToken()))
            return Forbid();

        var success = await _service.DeleteAsync(id, planId);
        if (!success) return NotFound();

        return NoContent();
    }

    // DELETE api/travel-plans/{planId}/expenses/all — interni poziv
    [HttpDelete("all")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteAll(Guid planId)
    {
        await _service.DeleteAllForPlanAsync(planId);
        return NoContent();
    }
}