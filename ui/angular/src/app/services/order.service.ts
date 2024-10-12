import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../shared/model/order";

import { ORDERS } from '../services/orders';

@Injectable({
  providedIn: "root"
})
export class OrderService {
  constructor(private httpClient: HttpClient) { }

  public getOrders(): Observable<Order[]> {
	return new Observable((subscriber) => {
		subscriber.next(ORDERS);
		subscriber.complete();
	  });
  }
}