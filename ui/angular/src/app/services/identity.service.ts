import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class IdentityService {
  constructor(private httpClient: HttpClient) { }

  public getCurrentUser(): Observable<{userName: string, email: string}> {
    return this.httpClient.get<{userName: string, email: string}>("/api/identity/current-user");
  }
}