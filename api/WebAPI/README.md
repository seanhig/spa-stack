# ASP.NET Core 8.0 WebAPI + SPA

An evolving scaffold of the latest dotnet core WebAPI + SPA framework, built on the [flink-stack examples]().  A simple web based UI for placing orders on the `Kafka` topic as a starting point for the flink workflows.

## What's Working

- Dev environment proxying to SPA `webserver`, production hosted builds inline.  Changes in 8.0 introduced some regressions with [UseProxyToSpaDevelopmentServer](https://exploding-kitten.com/2024/08-usespa-minimal-api).
- [NSwag](https://github.com/RicoSuter/NSwag) and the `/swagger` url.
- [EF Core](https://learn.microsoft.com/en-us/ef/core/)
- [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0)
   - With Google External OIDC
   - With Microsoft External OIDC
- [.NET Client for Kafka](https://docs.confluent.io/kafka-clients/dotnet/current/overview.html) and [Avrogen](https://www.nuget.org/packages/Apache.Avro.Tools/)

> __Note__: In development SPA engine must be running prior to starting the WebAPI when you are launching the web from the `dotnet run` environment.  However, the reverse is true if you working in the SPA `:4200` environment, which then proxies over to the `webapi:8090/api` and `webapi:8090/swagger` endpoints.

## Setup

### Appsettings.json

The `appsettings.json.sample` file must be copied to `appsettings.json` and filled out with the correct values.

```
  "ConnectionStrings": {
    "UserDBConnectionString": "server=host.docker.internal;database=spa_stack;uid=root;pwd=Fender2000;",
    "ErpDBConnectionString": "server=host.docker.internal;database=erpdb;uid=root;pwd=Fender2000;",
    "ShipDBConnectionString": "Server=host.docker.internal;Database=shipdb;Uid=postgres;Pwd=Fender2000;"
  },
  "GoogleClientId": "",
  "GoogleClientSecret": "",
  "MicrosoftClientId": "",
  "MicrosoftClientSecret": "",
  "KafkaBootstrapServers": "host.docker.internal:29092",
  "KafkaSchemaRegistryUrl": "http://host.docker.internal:8081"
``` 

The `datbase-stack` and `kafka-stack` connection strings have been left in the codebase as they are local secrets and purely for development purposes.  

However the `OIDC` provider `Client Ids and Secrets` are true secrets.  These must be registered manually by the developer and the values placed into the configuration.

> __Note:__ when registering redirect URI values for the OAuth providers, the redirects will be `https://localhost:8090/api/identity/google-signin` and/or `https://localhost:8090/api/identity/microsoft-signin`, respectively.

### Configure HTTPS (Required for OAuth)

On the `host` machine, create the cert and trust it.  Place the cert in the `.devcontainer` folder:
```
# host
dotnet dev-certs https --clean # remove old certs
dotnet dev-certs https -ep $WORK/spa-stack/.devcontainer/devcert.pfx --trust -p mycertpassword
```

In the `.devcontainer` environment, register and trust the same certificate.

```
# dev container
dotnet dev-certs https --clean --import /host/.devcontainer/devcert.pfx -p mycertpassword
dotnet dev-certs https --check --trust
```

## Launching

`dotnet run` will start up hosting on `https://localhost:8090`.

## Launching Docker Compose

1. `build-spa.sh angular` (creates the /dist folder)
2. `build.sh` (copies the devcert.pfx for inclusion in the container)
3. Copy `.env.sample` to `.env` and set the values.
3. `docker compose up -d`

The __General Store__ will then be available at `https://localhost:8090`.

When hosting in Kubernetes the development certificate will not be used, 
and the ASP.NET endpoint can be overridden via ENV variable (as per the docker-compose.yml) as:

```
      - ASPNETCORE_URLS=http://0.0.0.0:8090 
```

Enabling `Kubernetes` to manage ingress and TLS termination via `cert-manager`.

## Developer Notes

### Create Initial Project

```
dotnet new webapi -n WebAPI
cd WebAPI
dotnet add package Microsoft.AspNetCore.SpaServices.Extensions
```

### Specify Environment Override

To test the production configuration without altering the `launchSettings.json`:
```
DOTNET_ENVIRONMENT=Production dotnet run
```

### Client SPA Building and Proxying
For development, start the `ng` or `vite` server.  All SPA servers host on port `4200`, and all but `api` and `swagger` paths are forwarded to the SPA.

The `build-spa.sh` script will package the SPA client for production inclusion with the `WebAPI` project to be served as static files.  Simply specify the `frontend` to build:

```
./build-spa.sh angular
```

This was initially included in the MSBuild but then removed, as the C# Plugin in VSCode builds continually.  It is easier to include this step in the `Dockerfile` packaging process.

### EF Core & ASP.NET Code Generator

```
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
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

```

### ASP.NET Identity

```
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Authentication.Google
dotnet add package Microsoft.AspNetCore.Authentication.MicrosoftAccount
```

> Secrets are no longer used as `appsettings.json` is better suited to `ENV` based `Kubernetes Secrets` deployment. 
```
# Configure Google Client ID
dotnet user-secrets set "Authentication:Google:ClientId" "<client-id>"
dotnet user-secrets set "Authentication:Google:ClientSecret" "<client-secret>"

# Configure Microsoft Client ID
dotnet user-secrets set "Authentication:Microsoft:ClientId" "<client-id>"
dotnet user-secrets set "Authentication:Microsoft:ClientSecret" "<client-secret>"
```


### OAuth Setup Notes

Intially it was not so easy to identify Microsoft Cient IDs and Secrets.

```
AuthenticationFailureException: OAuth token endpoint failure: invalid_client;Description=AADSTS7000215: Invalid client secret provided. Ensure the secret being sent in the request is the client secret value, not the client secret ID, for a secret added to app 'd2307635-995a-4cee-99ca-a7de762f1d3f'. Trace ID: d3f29147-cf5e-4c47-b8f0-db12b0b64002 Correlation ID: 7884f97c-f6d2-41d8-a777-842e99ea6505 Timestamp: 2024-10-09 15:25:00Z;Uri=https://login.microsoftonline.com/error?code=7000215
```

The Client ID is the Application ID shown on the main application dashboard, not the secret id.  Also note that the secret id and value are reversed in the listing from what you might expect, so it is easy to mistakeknly copy the id, not the value, as the error implies.


### Migrating the Identity Store from In-Mem to MySQL
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
avrogen -s Models/Avro/weborder.avsc .

```