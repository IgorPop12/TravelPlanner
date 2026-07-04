using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TravelService.DTOs;

public class ActivityDto
{
    public Guid Id { get; set; }
    public Guid PlanId { get; set; }
    public Guid? DestinationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string? Time { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal EstimatedCost { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreateActivityDto
{
    public Guid? DestinationId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    public string? Time { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal EstimatedCost { get; set; }

    public string Status { get; set; } = "planned";
}