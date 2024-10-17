import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Shipment } from "../model/shipment";

@Injectable({
  providedIn: "root"
})
export class ShipmentService {
  constructor(private httpClient: HttpClient) { }

  public getShipments(): Observable<Shipment[]> {
    return this.httpClient.get<Shipment[]>("/api/shipment");
/* 	return new Observable((subscriber) => {
		subscriber.next(SHIPMENTS);
		subscriber.complete();
	  });
 */  }
}