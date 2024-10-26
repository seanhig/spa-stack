import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../../../model/order';
import { OrderController } from '../../../controllers/order.controller';
import { NgbdOrderSortableHeader, SortEvent } from '../../../shared/directives/order.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { OrdersTableComponent } from '../../shared/orders-table/orders-table.component';
import { tableConfig } from '../../shared/table.config';

@Component({
  selector: 'app-orders',
  standalone: true,
	imports: [OrdersTableComponent, DecimalPipe, DatePipe, FormsModule, AsyncPipe, NgbHighlight, NgbdOrderSortableHeader, NgbPaginationModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
	providers: [OrderController, DecimalPipe, DatePipe]
})
export class AllOrdersComponent {
	orders$: Observable<Order[]>;
	total$: Observable<number>;
	pageSizes: number[] = tableConfig.pageSizes;

	@ViewChildren(NgbdOrderSortableHeader) headers: QueryList<NgbdOrderSortableHeader> | undefined;

	constructor(public _controller: OrderController) {
		this.orders$ = _controller.orders$;
		this.total$ = _controller.total$;
	}

	ngOnInit(): void {
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

