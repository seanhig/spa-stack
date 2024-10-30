import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { Shipment } from '../model/shipment';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { ShipmentSortColumn, SortDirection } from '../shared/directives/shipment.sortable.directive';
import { ShipmentService } from '../services/shipment.service';

interface SearchResult {
	shipments: Shipment[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: ShipmentSortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(shipments: Shipment[], column: ShipmentSortColumn, direction: string): Shipment[] {
	if (direction === '' || column === '') {
		return shipments;
	} else {
		return [...shipments].sort((a, b) => {
			const res = compare(a[column].toString(), b[column].toString());
			return direction === 'asc' ? res : -res;
		});
	}
}

function matches(shipment: Shipment, term: string, pipe: PipeTransform) {
	return (
		shipment.origin.toLowerCase().includes(term.toLowerCase()) || 
		shipment.destination.toLowerCase().includes(term.toLowerCase()) 
	);
}

@Injectable({ providedIn: 'root' })
export class ShipmentController {
	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _shipments$ = new BehaviorSubject<Shipment[]>([]);
	private _shipmentResults : Shipment[] = [];
	private _total$ = new BehaviorSubject<number>(0);

	private _state: State = {
		page: 1,
		pageSize: 10,
		searchTerm: '',
		sortColumn: '',
		sortDirection: '',
	};

    constructor(private pipe: DecimalPipe, private _shipmentService: ShipmentService) {
//		this.search();
	}

    get shipments$() {
		return this._shipments$.asObservable();
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
	set sortColumn(sortColumn: ShipmentSortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}

	private _set(patch: Partial<State>) {
		Object.assign(this._state, patch);
		this._search$.next();
	}

	public search() {
		this._shipmentService.getShipments().subscribe((shipments) => {
			console.log("loaded new shipments: " + shipments?.length);
			this._shipmentResults = shipments;
			this._search$
				.pipe(
					tap(() => this._loading$.next(true)),
					debounceTime(100),
					switchMap(() => this._search()),
					delay(0),
					tap(() => this._loading$.next(false)),
				)
				.subscribe((result) => {
					this._shipments$.next(result.shipments);
					this._total$.next(result.total);
				});

			this._search$.next();		
		});
	}

    private _search(): Observable<SearchResult> {
		const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

		// 1. sort
		let shipments = sort(this._shipmentResults, sortColumn, sortDirection);

		// 2. filter
		shipments = shipments.filter((shipment) => matches(shipment, searchTerm, this.pipe));
		const total = shipments.length;

		// 3. paginate
		shipments = shipments.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
		return of({ shipments, total });
	}
}