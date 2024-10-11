import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Shipment } from '../../../shared/model/shipment';
import { ShipmentService } from '../../../services/shipment.service';
import { NgbdShipmentSortableHeader, SortEvent } from '../../../shared/directives/shipment.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shipments',
  standalone: true,
	imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdShipmentSortableHeader, NgbPaginationModule],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.scss',
	providers: [ShipmentService, DecimalPipe]
})
export class ShipmentsComponent {
	shipments$: Observable<Shipment[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdShipmentSortableHeader) headers: QueryList<NgbdShipmentSortableHeader> | undefined;

	constructor(public service: ShipmentService) {
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
