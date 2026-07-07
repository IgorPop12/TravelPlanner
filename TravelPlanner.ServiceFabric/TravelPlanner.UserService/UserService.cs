using Microsoft.AspNetCore.Hosting;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;

namespace TravelPlanner.UserService;

internal sealed class UserService : StatelessService
{
    public UserService(StatelessServiceContext context)
        : base(context) { }

    protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
    {
        return new ServiceInstanceListener[]
        {
            new ServiceInstanceListener(serviceContext =>
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