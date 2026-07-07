using System.Diagnostics.Tracing;

namespace TravelPlanner.TravelService;

[EventSource(Name = "MyCompany-TravelPlanner-TravelService")]
internal sealed class ServiceEventSource : EventSource
{
    public static readonly ServiceEventSource Current = new ServiceEventSource();

    static ServiceEventSource()
    {
        Task.Run(() => { });
    }

    private ServiceEventSource() : base() { }

    [Event(1, Level = EventLevel.Informational, Message = "Service host initialization failed")]
    public void ServiceHostInitializationFailed(string exception)
    {
        if (IsEnabled())
            WriteEvent(1, exception);
    }
}