# WebApp


```
ng g c shared/layouts/auth --standalone 
ng g c shared/layouts/main --standalone 
ng g c shared/layouts/home --standalone 

ng g c shared/layouts/main/header --standalone
ng g c shared/layouts/main/sidebar --standalone

ng g c view/home --standalone
ng g c view/signin --standalone
ng g c view/not-found --standalone
ng g c view/my-orders --standalone
ng g c view/admin/orders --standalone
ng g c view/admin/shipments --standalone
ng g c view/admin/products --standalone

ng g s services/auth --skip-tests
ng g guard services/auth --skip-tests

```