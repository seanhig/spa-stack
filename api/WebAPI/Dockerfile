# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY . /source

RUN dotnet restore
RUN dotnet publish -c release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# for local use we can re-use the trusted dev cert
# for kubernetes we can override with
# ASPNETCORE_URLS="http://0.0.0.0:5000"
RUN mkdir /.devcontainer
WORKDIR /.devcontainer
COPY devcert.pfx .

WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "WebAPI.dll"]