using Microsoft.ServiceFabric.Services.Runtime;
using TravelPlanner.ExpenseService;

try
{
    ServiceRuntime.RegisterServiceAsync("TravelPlanner.ExpenseServiceType",
        context => new ExpenseServiceHost(context)).GetAwaiter().GetResult();

    Thread.Sleep(Timeout.Infinite);
}
catch (Exception e)
{
    ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
    throw;
}