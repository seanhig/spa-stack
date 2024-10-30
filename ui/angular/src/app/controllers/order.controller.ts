import { Injectable, Input, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';

import { Order } from '../model/order';
import { DecimalPipe } from '@angular/common';
import { catchError, debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { OrderSortColumn, SortDirection } from '../shared/directives/order.sortable.directive';
import { OrderService } from '../services/order.service';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { WebOrder } from '../model/weborder';
import { HttpErrorResponse } from '@angular/common/http';

interface SearchResult {
	orders: Order[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: OrderSortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(orders: Order[], column: OrderSortColumn, direction: string): Order[] {
	if (direction === '' || column === '') {
		return orders;
	} else {
		return [...orders].sort((a, b) => {
			const res = compare(a[column].toString(), b[column].toString());
			return direction === 'asc' ? res : -res;
		});
	}
}

function matches(order: Order, term: string, pipe: PipeTransform) {
	return (
		order.customerName.toLowerCase().includes(term.toLowerCase()) ||
		order.orderId.toString().toLowerCase().includes(term.toLowerCase()) ||
		order.orderRef.toLowerCase().includes(term.toLowerCase())
	);
}

export enum MODE {
	ALL = 0,
	MyOrders
};

@Injectable({ providedIn: 'root' })
export class OrderController {
	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _orderResults: Order[] = [];
	private _orders$ = new BehaviorSubject<Order[]>([]);
	private _products$ = new BehaviorSubject<Product[]>([]);
	private _total$ = new BehaviorSubject<number>(0);

	private _mode: MODE = MODE.ALL;

	private _state: State = {
		page: 1,
		pageSize: 10,
		searchTerm: '',
		sortColumn: 'orderDate',
		sortDirection: 'desc',
	};

	constructor(private pipe: DecimalPipe,
		private _orderService: OrderService,
		private _authService: AuthService,
		private _productService: ProductService
	) {
		//this.search();
	}

	get orders$() {
		return this._orders$.asObservable();
	}
	get products$() {
		return this._products$.asObservable();
	}
	get total$() {
		return this._total$.asObservable();
	}
	get loading$() {
		return this._loading$.asObservable();
	}
	get page() {
		return this._state.page;
	}
	get pageSize() {
		return this._state.pageSize;
	}
	get searchTerm() {
		return this._state.searchTerm;
	}
	set page(page: number) {
		this._set({ page });
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}
	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}
	set sortColumn(sortColumn: OrderSortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}
	set mode(opmode: MODE) {
		this._mode = opmode;
	}

	private _set(patch: Partial<State>) {
		Object.assign(this._state, patch);
		this._search$.next();
	}

	public fetchProducts() {
		this._productService.getProducts().subscribe(products => {
			this._products$.next(products);
		});
	}

	public submitWebOrder(webOrder: WebOrder) : Observable<Object> {
		return this._orderService.submitWebOrder(webOrder);
	}

	public search() {
		var that = this;
		if (this._mode == MODE.ALL) {
			that._orderService.getOrders().subscribe((orders) => {
				console.log("loaded new orders: " + orders?.length);
				this._orderResults = orders;
				this._search$
					.pipe(
						tap(() => this._loading$.next(true)),
						debounceTime(100),
						switchMap(() => this._search()),
						delay(0),
						tap(() => this._loading$.next(false)),
					)
					.subscribe((result) => {
						this._orders$.next(result.orders);
						this._total$.next(result.total);
					});

				this._search$.next();
			});
		} else {
			this._authService.getActiveUser().subscribe(activeUser => {
				console.log("active user: " + activeUser.userName);
				that._orderService.getMyOrders(activeUser.userName)
					.subscribe((orders) => {
							console.log("loaded new orders: " + orders?.length);
							this._orderResults = orders;
							this._search$
								.pipe(
									tap(() => this._loading$.next(true)),
									debounceTime(200),
									switchMap(() => this._search()),
									delay(200),
									tap(() => this._loading$.next(false)),
								)
								.subscribe((result) => {
									this._orders$.next(result.orders);
									this._total$.next(result.total);
								});
							this._search$.next();
					});
			});
		}


	}

	private _search(): Observable<SearchResult> {
		const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

		// 1. sort
		let orders = sort(this._orderResults, sortColumn, sortDirection);

		// 2. filter
		orders = orders.filter((order) => matches(order, searchTerm, this.pipe));
		const total = orders.length;

		// 3. paginate
		orders = orders.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
		return of({ orders, total });
	}
}