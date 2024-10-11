using log4net;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.DB;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddControllers();

var userDB = builder.Configuration.GetConnectionString("UserDBConnectionString");
builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseMySql(userDB,
    MySqlServerVersion.LatestSupportedServerVersion)
);

builder.Services.AddDbContext<ErpdbContext>();
builder.Services.AddDbContext<ShipdbContext>();

builder.Services.AddAuthorization();

var configuration = builder.Configuration;

/*
    Originally had these as user-secrets, but those only work IsDevelopment 
    which makes testing IsProduction builds a pain.
    I think rather inject environment variables from k8s secrets anyway...
*/

var devServer = configuration["devServer"];
var googleClientId = configuration["GoogleClientId"];
var googleClientSecret = configuration["GoogleClientSecret"];
var microsoftClientId = configuration["MicrosoftClientId"];
var microsoftClientSecret = configuration["MicrosoftClientSecret"];

builder.Services.AddAuthentication().AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = googleClientId ?? throw new Exception("OAUTH: Google ClientId is EMPTY, closing.");
        googleOptions.ClientSecret = googleClientSecret ?? throw new Exception("OAUTH: Google Client Secret is EMPTY, closing.");
        googleOptions.SignInScheme = Microsoft.AspNetCore.Identity.IdentityConstants.ExternalScheme;
        googleOptions.CallbackPath = "/api/identity/signin-google";
    }).AddCookie().AddMicrosoftAccount(microsoftOptions =>
    {
        microsoftOptions.ClientId = microsoftClientId ?? throw new Exception("OAUTH: Microsoft ClientId is EMPTY, closing.");
        microsoftOptions.ClientSecret = microsoftClientSecret ?? throw new Exception("OAUTH: Microsoft Client Secret is EMPTY, closing.");
        microsoftOptions.SignInScheme = Microsoft.AspNetCore.Identity.IdentityConstants.ExternalScheme;
        microsoftOptions.CallbackPath = "/api/identity/signin-microsoft";
    });

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager();

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
        //configuration.RootPath = Path.Combine("..", "..", ".dist", "app", "browser");
        configuration.RootPath = "wwwroot";
    });
}

var app = builder.Build();

app.Logger.LogInformation("Starting WebAPI...");
app.Logger.LogInformation("ENV: " + app.Environment.EnvironmentName);

var identityMapGroup = app.MapGroup("/api").MapGroup("/identity");
identityMapGroup.MapIdentityApi<IdentityUser>();
identityMapGroup.WithGroupName("Identity").WithOpenApi();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

// UseProxyToSpaDevelopmentServer Quote broken in the minimal API model
// https://exploding-kitten.com/2024/08-usespa-minimal-api
app.UseWhen(
    context => !context.Request.Path.StartsWithSegments("/api") && !context.Request.Path.StartsWithSegments("/_api"),
    then => then.UseSpa(spa => {
    
    if (app.Environment.IsDevelopment())
    {
        app.Logger.LogInformation("Proxying to Angular Dev Server");
        //spa.UseAngularCliServer("start");  // this still does not work
        // so server must be manually started prior
        spa.UseProxyToSpaDevelopmentServer(devServer ?? throw new Exception("Development Server Not Specified!"));
    }
    else
    {
        app.Logger.LogInformation("Serving Angular Static Files");
        app.UseStaticFiles();
    }
}));

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
