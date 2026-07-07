using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;

namespace TravelPlanner.TravelService;

internal sealed class TravelService : StatefulService
{
    public TravelService(StatefulServiceContext context)
        : base(context) { }

    protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
    {
        return new ServiceReplicaListener[]
        {
            new ServiceReplicaListener(serviceContext =>
                new KestrelCommunicationListener(serviceContext, "ServiceEndpoint",
                    (url, listener) =>
                    {
                        var builder = WebApplication.CreateBuilder();
                        builder.WebHost.UseKestrel().UseUrls(url);
                        ServiceExtensions.ConfigureServices(builder);
                        var app = builder.Build();
                        ServiceExtensions.ConfigureApp(app);
                        return app;
                    }))
        };
    }
}
