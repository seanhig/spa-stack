import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Shipment } from '../../../shared/model/shipment';
import { ShipmentController } from '../../../controllers/shipment.controller';
import { NgbdShipmentSortableHeader, SortEvent } from '../../../shared/directives/shipment.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-shipments',
  standalone: true,
	imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdShipmentSortableHeader, NgbPaginationModule],
  templateUrl: './all-shipments.component.html',
  styleUrl: './all-shipments.component.scss',
	providers: [ShipmentController, DecimalPipe]
})
export class ShipmentsComponent {
	shipments$: Observable<Shipment[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdShipmentSortableHeader) headers: QueryList<NgbdShipmentSortableHeader> | undefined;

	constructor(public service: ShipmentController) {
		this.shipments$ = service.shipments$;
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
