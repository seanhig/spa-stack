# ASP.NET Core 8.0 WebAPI + Angular/React/Vanilla SPA Scaffold

An evolving scaffold of the latest dotnet core WebAPI + SPA framework

## What's Working

- Dev environment proxying to SPA `webserver`, production hosted builds inline.  Changes in 8.0 introduced some regressions with [UseProxyToSpaDevelopmentServer](https://exploding-kitten.com/2024/08-usespa-minimal-api).
- [NSwag](https://github.com/RicoSuter/NSwag) and the `/swagger` url.
- [EF Core](https://learn.microsoft.com/en-us/ef/core/)
- [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0)
   - With Google External OAuth
   - With Microsoft External OAuth

> __Note__: In development SPA engine must be running prior to starting the WebAPI when you are launching the web from the `dotnet run` environment.  However, the reverse is true if you working in the SPA `:4200` environment, which then proxies over to the `webapi:8090/api` and `webapi:8090/swagger` endpoints.


## Notes

```
dotnet new webapi -n WebAPI
dotnet new sln -n AngularWebAPI 
cd WebAPI
ng new App
dotnet sln add WebAPI
dotnet add package Microsoft.AspNetCore.SpaServices.Extensions

# host
dotnet dev-certs https --clean # remove old certs
dotnet dev-certs https -ep $WORK/spa-stack/.devcontainer/devcert.pfx --trust -p mycertpassword

# dev container
dotnet dev-certs https --clean --import /host/.devcontainer/devcert.pfx -p mycertpassword
dotnet dev-certs https --check --trust

DOTNET_ENVIRONMENT=Production dotnet run

dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet tool uninstall -g dotnet-aspnet-codegenerator
dotnet tool install -g dotnet-aspnet-codegenerator
dotnet tool update -g dotnet-aspnet-codegenerator

dotnet aspnet-codegenerator controller -name UserController -async -api -m User -dc UserContext -outDir Controllers

```

For development, start the `ng` or `vite` server.  All SPA servers host on port `4200`, and all but `api` and `swagger` paths are forwarded to the SPA.

To switch SPA front ends for production builds, change the SPA target to one of `angular`, `react` or `vanilla`:
```
   <Target Name="BuildSPAWebApp" BeforeTargets="PrepareForBuild">
      <Exec Command="$(ProjectDir)build-web.sh vanilla" />
  </Target>
```

```
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Pomelo.EntityFrameworkCore.MySql
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Oracle.EntityFrameworkCore

dotnet tool install --global dotnet-ef

# reverse engineer the erpdb and shipdb sample tables from the flink-stack
dotnet ef dbcontext scaffold "Server=host.docker.internal;Database=erpdb;Uid=root;Pwd=Fender2000;" Pomelo.EntityFrameworkCore.MySql \
--context-dir DB --output-dir Models \
--context-namespace WebAPI.DB --namespace WebAPI.Models

dotnet ef dbcontext scaffold "Server=host.docker.internal;Database=shipdb;Uid=postgres;Pwd=Fender2000;" Npgsql.EntityFrameworkCore.PostgreSQL \
--context-dir DB --output-dir Models \
--context-namespace WebAPI.DB --namespace WebAPI.Models

dotnet aspnet-codegenerator controller -name OrderController -async -api -m Order -dc ErpdbContext -outDir Controllers
dotnet aspnet-codegenerator controller -name ProductController -async -api -m Product -dc ErpdbContext -outDir Controllers
dotnet aspnet-codegenerator controller -name ShipmentController -async -api -m Shipment -dc ShipdbContext -outDir Controllers

dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore

dotnet add package Microsoft.AspNetCore.Authentication.Google

# Configure Google Client ID
dotnet user-secrets set "Authentication:Google:ClientId" "<client-id>"
dotnet user-secrets set "Authentication:Google:ClientSecret" "<client-secret>"

dotnet add package Microsoft.AspNetCore.Authentication.MicrosoftAccount

# Configure Microsoft Client ID
dotnet user-secrets set "Authentication:Microsoft:ClientId" "<client-id>"
dotnet user-secrets set "Authentication:Microsoft:ClientSecret" "<client-secret>"


```

This error says it all:

```
AuthenticationFailureException: OAuth token endpoint failure: invalid_client;Description=AADSTS7000215: Invalid client secret provided. Ensure the secret being sent in the request is the client secret value, not the client secret ID, for a secret added to app 'd2307635-995a-4cee-99ca-a7de762f1d3f'. Trace ID: d3f29147-cf5e-4c47-b8f0-db12b0b64002 Correlation ID: 7884f97c-f6d2-41d8-a777-842e99ea6505 Timestamp: 2024-10-09 15:25:00Z;Uri=https://login.microsoftonline.com/error?code=7000215
```

Microsoft has made it the Oauth creds quite convoluted.  The Client ID is the Application ID shown on the main application dashboard, not the secret id.  Also note that the secret id and value are reversed in the listing from what you might expect, so it is easy to mistakeknly copy the id, not the value, as the error implies.


### Migrating the Identity Store to MySQL
```
dotnet ef migrations add InitialCreate --context ApplicationDbContext --output-dir migrations/userDB
dotnet ef database update InitialCreate --context ApplicationDbContext
```

### Kafka and Avro

```
dotnet add package -v 2.6.0 Confluent.Kafka
dotnet add package -v 2.6.0 Confluent.SchemaRegistry
dotnet add package -v 2.6.0 Confluent.SchemaRegistry.Serdes.Protobuf
dotnet add package -v 2.6.0 Confluent.SchemaRegistry.Serdes.Json 
dotnet add package -v 2.6.0 Confluent.SchemaRegistry.Serdes.Avro

dotnet tool install --global Apache.Avro.Tools --version 1.12.0
# avrogen generates messy verbose code.

dotnet tool install Chr.Avro.Cli --global
dotnet avro generate < Models/Avro/weborder.avsc > Models/WebOrder.cs
# seems a lot cleaner, lets try it
```