using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TravelPlanner.UserService.Data;
using TravelPlanner.UserService.DTOs;
using TravelPlanner.UserService.Models;

namespace TravelPlanner.UserService.Services;

public class ShareTokenService
{
    private readonly UserDbContext _context;
    private readonly IConfiguration _config;

    public ShareTokenService(UserDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<ShareTokenDto> GenerateTokenAsync(Guid planId, string accessType)
    {
        var token = GenerateJwt(planId, accessType);
        var entity = new SharedPlanToken
        {
            Id = Guid.NewGuid(),
            PlanId = planId,
            Token = token,
            AccessType = accessType,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };

        _context.SharedPlanTokens.Add(entity);
        await _context.SaveChangesAsync();

        return new ShareTokenDto
        {
            Token = token,
            AccessType = accessType,
            ExpiresAt = entity.ExpiresAt
        };
    }

    public (Guid PlanId, string AccessType)? ValidateToken(string token)
    {
        try
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:ShareSecret"]!));

            var handler = new JwtSecurityTokenHandler();
            var principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateLifetime = true,
                ValidateIssuer = false,
                ValidateAudience = false
            }, out _);

            var planId = Guid.Parse(principal.FindFirst("plan_id")!.Value);
            var accessType = principal.FindFirst("access_type")!.Value;
            return (planId, accessType);
        }
        catch
        {
            return null;
        }
    }

    private string GenerateJwt(Guid planId, string accessType)
    {
        var claims = new[]
        {
            new Claim("plan_id", planId.ToString()),
            new Claim("access_type", accessType)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:ShareSecret"]!));

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}