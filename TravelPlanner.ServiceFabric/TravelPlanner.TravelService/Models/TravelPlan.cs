using System.Diagnostics;

namespace TravelPlanner.TravelService.Models;

public class TravelPlan
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Budget { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
    public ICollection<Activity> Activities { get; set; } = new List<Activity>();
    public ICollection<ChecklistItem> ChecklistItems { get; set; } = new List<ChecklistItem>();
}