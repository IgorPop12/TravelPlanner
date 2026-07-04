using Microsoft.AspNetCore.Mvc;
using TravelPlanner.UserService.DTOs;
using TravelPlanner.UserService.Services;

namespace TravelPlanner.UserService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(dto);

        if (result == null)
            return Conflict(new { message = "Email već postoji." });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.LoginAsync(dto);

        if (result == null)
            return Unauthorized(new { message = "Pogrešan email ili lozinka." });

        return Ok(result);
    }
}