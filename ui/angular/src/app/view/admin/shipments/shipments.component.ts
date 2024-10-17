import { AsyncPipe, DecimalPipe, NgFor } from '@angular/common';
import { Component, QueryList, ViewChildren} from '@angular/core';
import { Observable } from 'rxjs';

import { Shipment } from '../../../model/shipment';
import { ShipmentController } from '../../../controllers/shipment.controller';
import { NgbdShipmentSortableHeader, SortEvent } from '../../../shared/directives/shipment.sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { tableConfig } from '../../shared/table.config';

@Component({
  selector: 'app-shipments',
  standalone: true,
	imports: [DecimalPipe, NgFor, FormsModule, AsyncPipe, NgbHighlight, NgbdShipmentSortableHeader, NgbPaginationModule],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.scss',
	providers: [ShipmentController, DecimalPipe]
})
export class ShipmentsComponent {
	shipments$: Observable<Shipment[]>;
	total$: Observable<number>;
	pageSizes: number[] = tableConfig.pageSizes;

	@ViewChildren(NgbdShipmentSortableHeader) headers: QueryList<NgbdShipmentSortableHeader> | undefined;

	constructor(public _controller: ShipmentController) {
		this.shipments$ = _controller.shipments$;
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
