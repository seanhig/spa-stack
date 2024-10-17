import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { HttpEvent, HttpEventType, HttpHandler, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient()
/*     provideHttpClient(
      withInterceptors([loggingInterceptor])
    ) 
 */  ]
};

/* export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log("RXjs is a poorly designed and sketchy streaming lib!  Maybe less selfies would help them code better.");
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log("this didn't catch a 400 error at all, yet it is straight from the angular site");
      console.log(req.url, 'returned a response with status', event.status);
    } else {
      console.log("WTF sort of model is this, seriously?");
      console.error(event);
    }
  }));
}
 */