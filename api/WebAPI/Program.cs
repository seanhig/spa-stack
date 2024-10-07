using log4net;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.DB;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddControllers();

builder.Services.AddDbContext<UserContext>(opt =>
    opt.UseInMemoryDatabase("Users"));
builder.Services.AddDbContext<ErpdbContext>();
builder.Services.AddDbContext<ShipdbContext>();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(settings =>
{
    settings.Title = "WebAPI";
    settings.Version = "v1";
});

if (builder.Environment.IsProduction())
{
    builder.Services.AddSpaStaticFiles(configuration =>
    {
        configuration.RootPath = Path.Combine("..", "..", ".dist", "app", "browser");
    });
}

var app = builder.Build();

app.Logger.LogInformation("Starting WebAPI...");
app.Logger.LogInformation("ENV: " + app.Environment.EnvironmentName);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.Logger.LogInformation("DEV Mode");

    app.UseOpenApi();
    app.UseSwaggerUi();
}
else
{
    app.Logger.LogInformation("PROD Mode");
}


// UseProxyToSpaDevelopmentServer Quote broken in the minimal API model
// https://exploding-kitten.com/2024/08-usespa-minimal-api
app.UseWhen(
    context => !context.Request.Path.StartsWithSegments("/api") && !context.Request.Path.StartsWithSegments("/_api"),
    then => then.UseSpa(spa =>
    {
        if (app.Environment.IsDevelopment())
        {
            app.Logger.LogInformation("Proxying to Angular Dev Server");
            //spa.UseAngularCliServer("start");  // this still does not work
            // so server must be manually started prior
            spa.UseProxyToSpaDevelopmentServer($"http://localhost:4200");
        }
        else
        {
            app.Logger.LogInformation("Serving Angular Static Files");
            app.UseSpaStaticFiles();
        }
    }));

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
