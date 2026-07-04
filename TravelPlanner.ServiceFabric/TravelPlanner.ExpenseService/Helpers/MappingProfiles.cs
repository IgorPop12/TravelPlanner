using AutoMapper;
using TravelPlanner.ExpenseService.DTOs;
using TravelPlanner.ExpenseService.Models;

namespace TravelPlanner.ExpenseService.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Expense, ExpenseDto>();
    }
}
