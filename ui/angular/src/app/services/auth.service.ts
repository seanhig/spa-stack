import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../model/user';
import { NewUser } from '../model/newuser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _activeUser: User | undefined;

  constructor(private _httpClient: HttpClient, private _router: Router) {
    this.getCurrentUser();
  }


  public getCurrentUser() {
    this._httpClient.get<User>("/api/identity/current-user").subscribe(currentUser => {
      this._activeUser = currentUser;
    });
  }

  public getActiveUser() : Observable<User> {
    if(this._activeUser) {
      return new Observable((subscriber) => {
        subscriber.next(this._activeUser);
        subscriber.complete();
      });
    } else {
      return this._httpClient.get<User>("/api/identity/current-user");
    }
  }

  public hasActiveUser(): boolean{
    if(this._activeUser && this._activeUser.userName != null) { return true;}
    return false;
  }

  public activeUsername(): string {
    var user: string = "";
    if (this._activeUser) { user = this._activeUser.userName; }
    return user;
  }

  get activeUser() {
    return this._activeUser;
  }

  checkAuth() {
  }

  register(newUser: User) {
}

  signin(credentials: NewUser) {
  }

  signout() {
    this._httpClient.post("/api/identity/external-logout", {}).subscribe(ok => {
      this._router.navigate(['/site/home']);
    });

  }
}