using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TravelService.DTOs;

public class CreateTravelPlanDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Budžet ne može biti negativan.")]
    public decimal Budget { get; set; }

    public string Notes { get; set; } = string.Empty;
}