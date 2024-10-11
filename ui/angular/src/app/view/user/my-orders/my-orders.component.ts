import { AsyncPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../../../shared/model/order';
import { OrderService } from '../../../services/order.service';
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
	providers: [OrderService, DecimalPipe, DatePipe]
})
export class MyOrdersComponent {
  newOrderForm: FormGroup = {} as FormGroup;
  errorMessage: string = '';

	orders$: Observable<Order[]>;
	total$: Observable<number>;

  @ViewChild('newOrderProductSelect', { static: false }) newOrderProductSelect: ElementRef | undefined;  

	@ViewChildren(NgbdOrderSortableHeader) headers: QueryList<NgbdOrderSortableHeader> | undefined;

	constructor(public _orderService: OrderService, 
    private _fb: FormBuilder,
    private _router: Router) {
		this.orders$ = _orderService.orders$;
		this.total$ = _orderService.total$;
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

		this._orderService.sortColumn = column;
		this._orderService.sortDirection = direction;
	}
}

