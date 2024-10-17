import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../model/product";

import { PRODUCTS } from './products';

@Injectable({
  providedIn: "root"
})
export class ProductService {
  constructor(private httpClient: HttpClient) { }

  public getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>("/api/product");

/* 	return new Observable((subscriber) => {
		subscriber.next(PRODUCTS);
		subscriber.complete();
	  });
 */  }
}