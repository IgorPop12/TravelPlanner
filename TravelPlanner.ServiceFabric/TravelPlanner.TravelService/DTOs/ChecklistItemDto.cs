using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.TravelService.DTOs;

public class ChecklistItemDto
{
    public Guid Id { get; set; }
    public Guid PlanId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}

public class CreateChecklistItemDto
{
    [Required]
    [MaxLength(300)]
    public string Name { get; set; } = string.Empty;
}