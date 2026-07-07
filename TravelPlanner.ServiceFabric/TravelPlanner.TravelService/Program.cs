using Microsoft.ServiceFabric.Services.Runtime;
using TravelPlanner.TravelService;

try
{
    ServiceRuntime.RegisterServiceAsync("TravelPlanner.TravelServiceType",
        context => new TravelService(context)).GetAwaiter().GetResult();

    Thread.Sleep(Timeout.Infinite);
}
catch (Exception e)
{
    ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
    throw;
}