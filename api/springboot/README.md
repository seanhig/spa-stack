# SpringBoot REST API + SPA

Scaffold for SpringBoot REST backend.

> As the Angular UI was started with the Microsoft .NET Core API, and largely because SpringBoot requires extensive configuration to support SPA by contrast, SpringBoot has been adjusted to conform to the WebAPI service contract.

## What's Working

- [SpringBoot](https://spring.io/projects/spring-boot) REST
- SpringBoot JPA
- SpringBoot Identity
    - With Google Authentication
    - With Microsoft Authentication

> Currently has near feature parity to WebAPI and can use the same frontend Angular UI.  Kafka integration is all that remains.

## Setup

1. Copy the `env.sample` to `.env` and fill in the required secrets.
2. Load the environment variables into the shell `. ./loadenv.sh` using the script.
3. Run the application (Eg. `mvn spring-boot:run`)

### Frontend to Back
`Zuul` proxy is no longer supported in Spring, and was replaced with a `Spring Cloud Gateway`, which oddly does not work in the same project that uses `Spring Identity`, and there are class conflicts.

All this is to say that at the present time no analog can be found in the SpringBoot world that will approximate the functionality of Microsoft's `SPAProxy` when working with `Angular` or other frontend frameworks.

Until something can be put in place, the development workflow uses the frontend of `http://localhost:4200`, and leverages `Angular` and `Vite`'s `proxy.conf.json` to forward all specified `routes`.

Eg.
```
{
  "/api/**": {
    "target": "http://localhost:8090",
    "secure": false,
    "changeOrigin": true
  },
  "/swagger/**": {
    "target": "http://localhost:8090",
    "secure": false,
    "changeOrigin": true
  }

}
```


### The Users Table
The first time the SpringBoot app is executed JPA will auto-create the users table in the specified JDBC location.

As per the original design of the SpringBoot OAuth/OIDC implementation, the user `email` must pre-exist in the `users` table.  This is a check as part of the authentication process, and it will fail with an error indicating the missing user record.  This is a form of entry authorization.

## Developer Notes

### OIDC, Wow.

SpringBoot Identity offers much of the same functionality as Microsoft Identity and can be tweaked to perform in much the same fashion, but the SpringBoot docs are not good, especially pertaining to SPA and modern JS frameworks (the continued focus on MVC is quite antiquated).

Fortunately a very talented developer [put it all together and documented it with a series of articles](https://github.com/anitalakhadze/multiple-auth-api/blob/main/README.md).  I borrowed most of their code (with kind thanks), but tweaked the authorization token mechanism.  Instead of redirecting the auth request and token back to the client to be manually included in the request headers for all API calls, I included it as a cookie, much in the style of Asp.NET Identity.  Seems to work - and the frontend has no idea it is talking to SpringBoot instead of WebAPI.

### Spring Identity OAuth and Microsoft

Getting `Microsoft Login` to work required a fair bit of google support.

The [application.yaml](src/main/resources/application.yaml) does most of the work, and getting the various URLs correct is key.

```
    microsoft:
        client-id: ${MICROSOFTCLIENTID}
        client-secret: ${MICROSOFTCLIENTSECRET}
        scope: openid, email, profile, api://d2307635-995a-4cee-99ca-a7de762f1d3f/WebAccess
        client-name: Microsoft
        authorization-grant-type: authorization_code
        provider: microsoft
        redirect-uri: '{baseUrl}/api/oauth2/callback/{registrationId}'
provider:
    microsoft:
        authorization-uri: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
        key-set-uri: https://login.microsoftonline.com/common/discovery/v2.0/keys
        token-uri: https://login.microsoftonline.com/common/oauth2/v2.0/token
        user-info-uri: https://graph.microsoft.com/oidc/userinfo
        userNameAttribute: sub
        issuer-uri: https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0

```
Note the hardcoded tenant id in the `issuer-uri`.  This must be used with Microsoft common login.

If the `issuer-uri` is incorrect, but valid (such as using a different tenant, or MS uri), the error will come back as:

```
 [invalid_id_token] An error occurred while attempting to decode the Jwt: Signed JWT rejected: Another algorithm expected, or no matching key(s) found
```

This is not entirely obvious.  The token can even be verified on [jwt.io](jwt.io)... which is what helps to solve the issue, as it contains the `issuer`.  Once these are properly rationalized, the error goes away.

Another `gotcha` is that `Microsoft OIDC` requires that `oidc` be specified in the `scope` (while Google does not).

When the scope includes `oidc` Spring Identity changes the User class from `UserPrincipal` to `DefaultOidcUser`.  This will cause a `ClassCastException` until you realize this is going on, and the classes are not related.

As `DefaultOidcUser` does not contain a `getId()` accessor, `getEmail()` was used as the embedded token user reference.

With these changes in place both `Google` and `Microsoft` OIDC login are working in SpringBoot.