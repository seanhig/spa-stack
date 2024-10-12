import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Shipment } from "../shared/model/shipment";

import { SHIPMENTS } from './shipments';

@Injectable({
  providedIn: "root"
})
export class ShipmentService {
  constructor(private httpClient: HttpClient) { }

  public getShipments(): Observable<Shipment[]> {
	return new Observable((subscriber) => {
		subscriber.next(SHIPMENTS);
		subscriber.complete();
	  });
  }
}