# SPA Stack
A collection of interoperable Frontend and Backend implementations for delivering dockerized SPA applications, implemented with a development environment `devcontainer`.

## The REST API Backends
All located in the [api](api) folder.

1. [C# .NET Core 8.0 WebAPI](api/WebAPI/)
2. [Spring Boot 5 REST+](api/springboot/)
2. [ExpressJS](api/express/)

Each of these will implement the same backend API, with the goal of being interoperable with each of the frontends.

All backends are hosted on `https://:8090`.

## The SPA Frontends
All located in the [ui](ui) folder.

1. [Angular 18](ui/angular/)
2. [React](ui/react/)
3. [VanillaJS](ui/vanilla/)

Each of these will implement a slightly different UI approach to the standardized API backend.

All frontends are hosted in development on `https://

> It is already worth noting that the time to get `vanillaJS + ExpressJS` working was minutes or seconds as compared to the hours/days spent wiring up the `Java/C#` backends.  Amazing how similar `SpringBoot` and `.NET Core` are turning out to be.

```
cd ui
ng new angular
npm create vite@latest react -- --template react-ts
npm create vite@latest vanilla -- --template vanilla
```

The `Vite` projects and `Angular` are all configured to build to the same location: `.dist/app/browser`, which is then picked up for deployment by the `WebAPI` and `springboot` packages.  ExpressJS is simply configured to static host.
