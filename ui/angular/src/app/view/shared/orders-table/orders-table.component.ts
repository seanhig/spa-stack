import { AsyncPipe, DatePipe, DecimalPipe, CurrencyPipe, NgFor } from '@angular/common';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../../../model/order';
import { MODE, OrderController } from '../../../controllers/order.controller';
import { NgbdOrderSortableHeader, SortEvent } from '../../../shared/directives/order.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { tableConfig } from '../table.config';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-orders-table',
	standalone: true,
	imports: [DecimalPipe, NgFor, DatePipe, CurrencyPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdOrderSortableHeader, NgbPaginationModule],
	templateUrl: './orders-table.component.html',
	styleUrl: './orders-table.component.scss',
	providers: [OrderController, DecimalPipe, DatePipe]
})
export class OrdersTableComponent {
	orders$: Observable<Order[]>;
	total$: Observable<number>;
	pageSizes: number[] = tableConfig.pageSizes;
	@Input() mode: MODE = MODE.ALL;

	@ViewChildren(NgbdOrderSortableHeader) headers: QueryList<NgbdOrderSortableHeader> | undefined;

	constructor(public _controller: OrderController,
		public _authService: AuthService
	) {
		this.orders$ = this._controller.orders$;
		this.total$ = this._controller.total$;
	}

	ngOnInit() {
		this._controller.mode = this.mode;
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

