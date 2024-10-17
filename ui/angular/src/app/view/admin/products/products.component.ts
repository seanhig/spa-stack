import { AsyncPipe, DecimalPipe, NgFor } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../../../model/product';
import { ProductController } from '../../../controllers/product.controller';
import { NgbdProductSortableHeader, SortEvent } from '../../../shared/directives/product.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { tableConfig } from '../../shared/table.config';

@Component({
  selector: 'app-products',
  standalone: true,
	imports: [DecimalPipe, NgFor, FormsModule, AsyncPipe, NgbHighlight, NgbdProductSortableHeader, NgbPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
	providers: [ProductController, DecimalPipe]
})
export class ProductsComponent {
	products$: Observable<Product[]>;
	total$: Observable<number>;
	pageSizes: number[] = tableConfig.pageSizes;

	@ViewChildren(NgbdProductSortableHeader) headers: QueryList<NgbdProductSortableHeader> | undefined;

	constructor(public _controller: ProductController) {
		this.products$ = _controller.products$;
		this.total$ = _controller.total$;
	}

	ngOnInit() {
		this._controller.search();
	}
	
	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers?.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this._controller.sortColumn = column;
		this._controller.sortDirection = direction;
	}
}
