using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Net.Http.Headers;
using TravelPlanner.UserService.Data;
using TravelPlanner.UserService.DTOs;

namespace TravelPlanner.UserService.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserDbContext _context;
    private readonly IMapper _mapper;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public UsersController(UserDbContext context, IMapper mapper, IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _context = context;
        _mapper = mapper;
        _httpClient = httpClientFactory.CreateClient();
        _config = config;
    }


    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(_mapper.Map<List<UserDto>>(users));
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        return Ok(_mapper.Map<UserDto>(user));
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var authToken = Request.Headers.Authorization.ToString();
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", authToken.Replace("Bearer ", ""));

        var travelUrl = _config["Services:TravelServiceUrl"];
        var expenseUrl = _config["Services:ExpenseServiceUrl"];

        var plansResponse = await _httpClient.GetAsync($"{travelUrl}/api/travel-plans/by-user/{id}");

        if (plansResponse.IsSuccessStatusCode)
        {
            var plans = await plansResponse.Content
                .ReadFromJsonAsync<List<TravelPlanResponse>>();

            if (plans != null)
            {
                foreach (var plan in plans)
                {
                    await _httpClient.DeleteAsync(
                        $"{expenseUrl}/api/travel-plans/{plan.Id}/expenses/all");

                    await _httpClient.DeleteAsync(
                        $"{travelUrl}/api/travel-plans/{plan.Id}");
                }
            }
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private class TravelPlanResponse
    {
        public Guid Id { get; set; }
    }
}