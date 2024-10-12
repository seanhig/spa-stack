import { AsyncPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../../../shared/model/order';
import { OrderController } from '../../../controllers/order.controller';
import { NgbdOrderSortableHeader, SortEvent } from '../../../shared/directives/order.sortable.directive';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';

import { OrdersTableComponent } from '../../shared/orders-table/orders-table.component';
import { tableConfig } from '../../shared/table.config';

@Component({
  selector: 'app-my-orders',
  standalone: true,
	imports: [OrdersTableComponent, 
    DecimalPipe, 
    DatePipe, 
    FormsModule, 
    AsyncPipe, 
    NgbHighlight, 
    NgbdOrderSortableHeader, 
    NgbPaginationModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
	providers: [OrderController, DecimalPipe, DatePipe]
})
export class MyOrdersComponent {
  newOrderForm: FormGroup = {} as FormGroup;
  errorMessage: string = '';
  pageSizes: number[] = tableConfig.pageSizes;

	orders$: Observable<Order[]>;
	total$: Observable<number>;

  @ViewChild('newOrderProductSelect', { static: false }) newOrderProductSelect: ElementRef | undefined;  

	@ViewChildren(NgbdOrderSortableHeader) headers: QueryList<NgbdOrderSortableHeader> | undefined;

	constructor(public _orderController: OrderController, 
    private _fb: FormBuilder,
    private _router: Router) {
		this.orders$ = _orderController.orders$;
		this.total$ = _orderController.total$;
	}

  ngOnInit(): void {
    this.buildBasicForm();
    localStorage.clear();
  }

  buildBasicForm() {

    this.newOrderForm = this._fb.group({
      newOrderProductSelect: ['', [Validators.required]],
      newOrderQuantity: ['', [Validators.required]],
      newOrderDestination: ['', [Validators.required]]
    });

    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.newOrderProductSelect?.nativeElement.focus();
    },100); 

  }

  submitOrder() {
    this.errorMessage = '';
  /*     
    this.auth.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl('/auth/signin?username=' + this.registerForm.value.email);
      },
      error: (err: string) => {
        this.errorMessage = err;
      }
    });
  */    
  }  

	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers?.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this._orderController.sortColumn = column;
		this._orderController.sortDirection = direction;
	}
}

