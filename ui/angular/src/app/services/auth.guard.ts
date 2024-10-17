import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  
  canActivate() {
    return true;
/*     if (this.auth.authenticated) {
      return true;
    } else {
      return this.router.navigateByUrl('/signin');
    }
 */  }
}