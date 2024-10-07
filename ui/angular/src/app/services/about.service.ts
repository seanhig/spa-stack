import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AboutService {
  constructor(private httpClient: HttpClient) { }

  public getApi(): Observable<{apiName: string, version: string}> {
    return this.httpClient.get<{apiName: string, version: string}>("/api/about");
  }
}