using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TravelPlanner.TravelService.Data;
using TravelPlanner.TravelService.Services;

namespace TravelPlanner.TravelService;

public static class ServiceExtensions
{
    public static void ConfigureServices(WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<TravelDbContext>(options =>
            options.UseSqlServer(builder.Configuration
                .GetConnectionString("DefaultConnection")));

        var jwtKey = builder.Configuration["Jwt:Key"];
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey!)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true
                };
            });

        builder.Services.AddAutoMapper(typeof(ServiceExtensions));
        builder.Services.AddScoped<TravelPlanService>();
        builder.Services.AddScoped<DestinationService>();
        builder.Services.AddScoped<ActivityService>();
        builder.Services.AddScoped<ChecklistService>();
        builder.Services.AddHttpClient();
        builder.Services.AddHttpClient<ActivityService>();
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Unesi: Bearer {token}"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod());
        });
    }

    public static void ConfigureApp(WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseCors("AllowFrontend");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
    }
}
