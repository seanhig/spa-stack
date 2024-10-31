import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { User } from '../model/user';
import { NewUser } from '../model/newuser';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _activeUser: User | undefined;

  constructor(private _httpClient: HttpClient, private _router: Router) {
    this.getCurrentUser(() => {});
  }


  public getCurrentUser(callback: Function) {
    this._httpClient.get<User>("/api/identity/current-user").subscribe(currentUser => {
      this._activeUser = currentUser;
      callback?.()
    });
  }

  public getActiveUser() : Observable<User> {
    if(this._activeUser) {
      console.log("returning cached active user");
      return new Observable((subscriber) => {
        subscriber.next(this._activeUser);
        subscriber.complete();
      });
    } else {
      return new Observable((subscriber) => {
        console.log("fetching active user");
        this.getCurrentUser(() => {
          subscriber.next(this._activeUser);
          subscriber.complete();  
        })
      });
    }
  }

  public hasActiveUser(): boolean{
    if(this._activeUser && this._activeUser.userName != null) { 
      return true;
    }
    return false;
  }

  public activeUsername(): string {
    let user: string = "";
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
    this._activeUser = undefined;
    return this._httpClient.post("/api/identity/external-logout",  {})
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}