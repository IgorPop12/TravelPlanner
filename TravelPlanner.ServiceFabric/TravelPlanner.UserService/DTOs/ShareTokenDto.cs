namespace TravelPlanner.UserService.DTOs;

public class ShareTokenDto
{
    public string Token { get; set; } = string.Empty;
    public string AccessType { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class CreateShareTokenDto
{
    public Guid PlanId { get; set; }
    public string AccessType { get; set; } = "VIEW";
}

public class ValidateShareTokenDto
{
    public string Token { get; set; } = string.Empty;
}

public class ValidateShareTokenResponseDto
{
    public Guid PlanId { get; set; }
    public string AccessType { get; set; } = string.Empty;
}
