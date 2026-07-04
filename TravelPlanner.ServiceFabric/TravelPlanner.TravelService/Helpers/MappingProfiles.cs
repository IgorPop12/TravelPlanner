using AutoMapper;
using TravelPlanner.TravelService.DTOs;
using TravelPlanner.TravelService.Models;

namespace TravelPlanner.TravelService.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<TravelPlan, TravelPlanDto>();
        CreateMap<Destination, DestinationDto>();
        CreateMap<Activity, ActivityDto>();
        CreateMap<ChecklistItem, ChecklistItemDto>();
    }
}
