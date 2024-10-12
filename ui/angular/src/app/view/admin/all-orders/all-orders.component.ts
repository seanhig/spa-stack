import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../../../shared/model/order';
import { OrderController } from '../../../controllers/order.controller';
import { NgbdOrderSortableHeader, SortEvent } from '../../../shared/directives/order.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { OrdersTableComponent } from '../../shared/orders-table/orders-table.component';

@Component({
  selector: 'app-all-orders',
  standalone: true,
	imports: [OrdersTableComponent, DecimalPipe, DatePipe, FormsModule, AsyncPipe, NgbHighlight, NgbdOrderSortableHeader, NgbPaginationModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss',
	providers: [OrderController, DecimalPipe, DatePipe]
})
export class AllOrdersComponent {
	orders$: Observable<Order[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdOrderSortableHeader) headers: QueryList<NgbdOrderSortableHeader> | undefined;

	constructor(public service: OrderController) {
		this.orders$ = service.orders$;
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

