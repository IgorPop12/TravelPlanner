namespace TravelPlanner.UserService.Models;

public class SharedPlanToken
{
    public Guid Id { get; set; }
    public Guid PlanId { get; set; }
    public string Token { get; set; } = string.Empty;
    public string AccessType { get; set; } = "VIEW"; // "VIEW" ili "EDIT"
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
}