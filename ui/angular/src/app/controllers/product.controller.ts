import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { Product } from '../model/product';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { ProductSortColumn, SortDirection } from '../shared/directives/product.sortable.directive';
import { ProductService } from '../services/product.service';

interface SearchResult {
	products: Product[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: ProductSortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(products: Product[], column: ProductSortColumn, direction: string): Product[] {
	if (direction === '' || column === '') {
		return products;
	} else {
		return [...products].sort((a, b) => {
			const res = compare(a[column], b[column]);
			return direction === 'asc' ? res : -res;
		});
	}
}

function matches(product: Product, term: string, pipe: PipeTransform) {
	return (
		product.name.toLowerCase().includes(term.toLowerCase()) ||
		product.description.toLowerCase().includes(term.toLowerCase()) ||
		product.price.toString().toLowerCase().includes(term.toLowerCase())
	);
}

@Injectable({ providedIn: 'root' })
export class ProductController {
	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _products$ = new BehaviorSubject<Product[]>([]);
	private _productResults : Product[] = [];
	private _total$ = new BehaviorSubject<number>(0);

	private _state: State = {
		page: 1,
		pageSize: 10,
		searchTerm: '',
		sortColumn: '',
		sortDirection: '',
	};

    constructor(private pipe: DecimalPipe, private _productService: ProductService) {
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
	set sortColumn(sortColumn: ProductSortColumn) {
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
		this._productService.getProducts().subscribe((products) => {
			console.log("loaded new products: " + products?.length);
			this._productResults = products;
			this._search$
				.pipe(
					tap(() => this._loading$.next(true)),
					debounceTime(100),
					switchMap(() => this._search()),
					delay(0),
					tap(() => this._loading$.next(false)),
				)
				.subscribe((result) => {
					this._products$.next(result.products);
					this._total$.next(result.total);
				});

			this._search$.next();			
		});		
	}

    private _search(): Observable<SearchResult> {
		const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

		// 1. sort
		let products = sort(this._productResults, sortColumn, sortDirection);

		// 2. filter
		products = products.filter((product) => matches(product, searchTerm, this.pipe));
		const total = products.length;

		// 3. paginate
		products = products.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
		return of({ products, total });
	}
}