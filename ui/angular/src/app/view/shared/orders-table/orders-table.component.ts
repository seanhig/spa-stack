import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../../../shared/model/order';
import { OrderService } from '../../../services/order.service';
import { NgbdOrderSortableHeader, SortEvent } from '../../../shared/directives/order.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders-table',
  standalone: true,
	imports: [DecimalPipe, DatePipe, FormsModule, AsyncPipe, NgbHighlight, NgbdOrderSortableHeader, NgbPaginationModule],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss',
	providers: [OrderService, DecimalPipe, DatePipe]
})
export class OrdersTableComponent {
	orders$: Observable<Order[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdOrderSortableHeader) headers: QueryList<NgbdOrderSortableHeader> | undefined;

	constructor(public service: OrderService) {
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

