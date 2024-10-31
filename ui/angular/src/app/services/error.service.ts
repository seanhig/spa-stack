import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {

    constructor (private _router : Router, 
      private _authService: AuthService
    ) {
        
    }

  handleError(error: any): void {
    if(error.status == 401) {
        this._authService.signout();
        this._router.navigateByUrl("/auth/signin");
    } else {
        console.error("An unhandled error: " + error.message);
        console.log(error);     
        throw error;   
    }
  }
}