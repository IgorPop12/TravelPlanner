using Microsoft.ServiceFabric.Services.Runtime;
using TravelPlanner.UserService;

try
{
    ServiceRuntime.RegisterServiceAsync("TravelPlanner.UserServiceType",
        context => new UserService(context)).GetAwaiter().GetResult();

    Thread.Sleep(Timeout.Infinite);
}
catch (Exception e)
{
    ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
    throw;
}