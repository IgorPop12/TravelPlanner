using AutoMapper;
using TravelPlanner.UserService.DTOs;
using TravelPlanner.UserService.Models;

namespace TravelPlanner.UserService.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<User, UserDto>();
    }
}