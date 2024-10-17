import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, subscribeOn, tap, throwError } from "rxjs";
import { Order } from "../model/order";

import { ORDERS } from '../services/orders';
import { WebOrder } from "../model/weborder";

@Injectable({
	providedIn: "root"
})
export class OrderService {
	constructor(private _httpClient: HttpClient) { }

	public getOrders(): Observable<Order[]> {
		return this._httpClient.get<Order[]>("/api/order");
	}

	public getMyOrders(customerName: string): Observable<Order[]> {
		console.log("get my orders for: " + customerName);
		return this._httpClient.get<Order[]>("/api/order?customerName=" + customerName);
	}

	public submitWebOrder(webOrder: WebOrder) {
		this._httpClient.post("/api/weborders", webOrder).subscribe( response => {
			console.log("submitted web order!");
			console.log(response);
		});
	}

	
}