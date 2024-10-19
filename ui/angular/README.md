# Angular SPA

An Angular SPA using `ngBootstrap` for the UI framework, implementing [The General Store](../../README.md#context-and-concept-the-general-store) frontend.

## Setup

The `proxy.conf.json` proxies to the API backend when using the `http://localhost:4200` address.  However this will not work for OAuth, as it requires the `https://localhost:8090` endpoint, and more specifically, `HTTPS`.  For this reason development is usually done from the other direction, using the API url, which then proxies to the `ng server`.

### Developer Notes

```
ng g c shared/layouts/auth --standalone 
ng g c shared/layouts/main --standalone 
ng g c shared/layouts/home --standalone 

etc.

ng g s services/auth --skip-tests
ng g guard services/auth --skip-tests

```