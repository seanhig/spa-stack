import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../../../shared/model/product';
import { ProductService } from '../../../services/product.service';
import { NgbdProductSortableHeader, SortEvent } from '../../../shared/directives/product.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-products',
  standalone: true,
	imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdProductSortableHeader, NgbPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
	providers: [ProductService, DecimalPipe]
})
export class ProductsComponent {
	products$: Observable<Product[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdProductSortableHeader) headers: QueryList<NgbdProductSortableHeader> | undefined;

	constructor(public service: ProductService) {
		this.products$ = service.products$;
		this.total$ = service.total$;
	}

	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers?.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.service.sortColumn = column;
		this.service.sortDirection = direction;
	}
}
