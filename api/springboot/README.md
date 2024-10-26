# SpringBoot REST API + SPA

Scaffold for SpringBoot REST backend.

> As the Angular UI was started with the Microsoft .NET Core API, and largely because SpringBoot requires extensive configuration to support SPA by contrast, SpringBoot has been adjusted to conform to the WebAPI service contract.

## What's Working

- SpringBoot REST
- SpringBoot JPA
- SpringBoot Identity
    - With Google Authentication


> Currently has near feature parity to WebAPI and can use the same frontend Angular UI.  Kafka integration and some tweaking for MS OAuth are all that remain.

## Setup

1. Copy the `env.sample` to `.env` and fill in the required secrets.
2. Load the environment variables into the shell `. ./loadenv.sh` using the script.
3. Run the application (Eg. `mvn spring-boot:run`)

## Developer Notes

### OAuth, Wow.

SpringBoot Identity offers much of the same functionality as Microsoft Identity and can be tweaked to perform in much the same fashion, but the SpringBoot docs are not good, especially pertaining to SPA and modern JS frameworks (the continued focus on MVC is quite antiquated).

Fortunately a very talented developer [put it all together and documented it with a series of articles](https://github.com/anitalakhadze/multiple-auth-api/blob/main/README.md).  I borrowed most of their code (with kind thanks), but tweaked the authorization token mechanism.  Instead of redirecting the auth request and token back to the client to be manually included in the request headers for all API calls, I included it as a cookie, much in the style of Asp.NET Identity.  Seems to work nicely and the frontend has no idea it is talking to SpringBoot instead of WebAPI.