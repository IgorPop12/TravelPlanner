namespace TravelPlanner.TravelService.Models;

public class Activity
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
    public string Status { get; set; } = "planned"; // planned, reserved, completed, cancelled

    public TravelPlan Plan { get; set; } = null!;
    public Destination? Destination { get; set; }
}