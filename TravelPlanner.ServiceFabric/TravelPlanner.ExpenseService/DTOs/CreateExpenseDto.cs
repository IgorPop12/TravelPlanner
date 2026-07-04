using System.ComponentModel.DataAnnotations;

namespace TravelPlanner.ExpenseService.DTOs;

public class CreateExpenseDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty; // transport, accommodation, food, tickets, shopping, other

    [Range(0, double.MaxValue, ErrorMessage = "Iznos ne može biti negativan.")]
    public decimal Amount { get; set; }

    [Required]
    public DateTime Date { get; set; }

    public string Description { get; set; } = string.Empty;
}