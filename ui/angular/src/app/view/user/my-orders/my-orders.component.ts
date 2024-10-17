import { AsyncPipe, DatePipe, DecimalPipe, CurrencyPipe, NgIf } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { Guid } from 'guid-typescript';
import { Order } from '../../../model/order';
import { WebOrder } from '../../../model/weborder';
import { OrderController, MODE } from '../../../controllers/order.controller';
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
import { Product } from '../../../model/product';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
	imports: [OrdersTableComponent, 
    DecimalPipe, 
    CurrencyPipe,
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
  orderTotal: number = 0.0;

	products$: Observable<Product[]>;
	total$: Observable<number>;

  @ViewChild('productId', { static: false }) newOrderProductSelect: ElementRef | undefined;  

	@ViewChildren(NgbdOrderSortableHeader) headers: QueryList<NgbdOrderSortableHeader> | undefined;

  public ORDERMODE = MODE;

	constructor(public _authService: AuthService,
    public _orderController: OrderController,
    private _fb: FormBuilder,
    private _router: Router) {
		this.orders$ = _orderController.orders$;
		this.products$ = _orderController.products$;
		this.total$ = _orderController.total$;
	}

  ngOnInit(): void {

    this._orderController.fetchProducts();

    this.buildBasicForm();
    localStorage.clear();
  }

  buildBasicForm() {

    this.newOrderForm = this._fb.group({
      productId: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      destination: ['', [Validators.required]]
    });

    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.newOrderProductSelect?.nativeElement.focus();
    },100); 

  }

  calculateOrderTotal() {
    var productId = this.newOrderForm.get("productId")?.value;
    var quantity = this.newOrderForm.get("quantity")?.value;

    console.log("qty: " + quantity);
    if(quantity == "" || quantity == null || quantity == undefined) { return; }

    this.products$.forEach(products => {
      for(var i=0; i< products.length; i++) {
        var p : Product  = products[i];
        if(p.id == productId) {
          console.log("price is: " + p.price);
          var orderTotal = p.price * quantity;
          console.log("order total: " + orderTotal);
          this.orderTotal = orderTotal;
        }
      }
    });

    console.log("calculate: productId: " + productId + ", qty: " + quantity);
  }

  submitOrder() {
    this.errorMessage = '';
    console.log("New Order:");
    //console.log(this.newOrderForm.value);

    var webOrder: WebOrder = this.newOrderForm.value;
    webOrder.webOrderId = Guid.create().toString();
    if(this._authService.activeUser !== undefined) {
      webOrder.customerName = this._authService.activeUser.userName;
    }

    console.log("sending:");
    console.log(webOrder);

    try {
      this._orderController.submitWebOrder(webOrder);
      console.log("Web Order SENT!");
    } catch(ex) {
      console.log("error sending: " + ex);
    }
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

