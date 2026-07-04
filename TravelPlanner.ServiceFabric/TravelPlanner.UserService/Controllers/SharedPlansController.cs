using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlanner.UserService.DTOs;
using TravelPlanner.UserService.Services;

namespace TravelPlanner.UserService.Controllers;

[ApiController]
[Route("api/shared-plans")]
public class SharedPlansController : ControllerBase
{
    private readonly ShareTokenService _shareTokenService;

    public SharedPlansController(ShareTokenService shareTokenService)
    {
        _shareTokenService = shareTokenService;
    }

    // Generiši token — samo ulogovani korisnik
    [HttpPost("tokens")]
    [Authorize]
    public async Task<IActionResult> GenerateToken([FromBody] CreateShareTokenDto dto)
    {
        if (dto.AccessType != "VIEW" && dto.AccessType != "EDIT")
            return BadRequest(new { message = "AccessType mora biti VIEW ili EDIT." });

        var result = await _shareTokenService.GenerateTokenAsync(dto.PlanId, dto.AccessType);
        return Ok(result);
    }

    // Validiraj token — javni endpoint (bez autentikacije)
    [HttpPost("validate")]
    public IActionResult ValidateToken([FromBody] ValidateShareTokenDto dto)
    {
        var result = _shareTokenService.ValidateToken(dto.Token);

        if (result == null)
            return Unauthorized(new { message = "Token nije validan ili je istekao." });

        return Ok(new ValidateShareTokenResponseDto
        {
            PlanId = result.Value.PlanId,
            AccessType = result.Value.AccessType
        });
    }
}