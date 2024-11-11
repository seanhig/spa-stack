import { AsyncPipe, DatePipe, DecimalPipe, CurrencyPipe, NgIf } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';
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
  AbstractControl
} from '@angular/forms';

import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    NgIf,
    NgbAlertModule
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
	providers: [OrderController, DecimalPipe, DatePipe]
})
export class MyOrdersComponent {
  newOrderForm: FormGroup = {} as FormGroup;

  errorMessage: string = "";
  successMessage: string = "";
  private _successMessage$ = new Subject<string>();
  private _errorMessage$ = new Subject<string>();

  pageSizes: number[] = tableConfig.pageSizes;

	orders$: Observable<Order[]>;
  orderTotal: number = 0.0;

	products$: Observable<Product[]>;
	total$: Observable<number>;

  @ViewChild('productId', { static: false }) newOrderProductSelect: ElementRef | undefined;  
  
  @ViewChild('successMessageAlert', { static: false }) successMessageAlert: NgbAlert | undefined;
  @ViewChild('errorMessageAlert', { static: false }) errorMessageAlert: NgbAlert | undefined;

	@ViewChildren(NgbdOrderSortableHeader) headers: QueryList<NgbdOrderSortableHeader> | undefined;

  public ORDERMODE = MODE;

	constructor(public _authService: AuthService,
    public _orderController: OrderController,
    private _fb: FormBuilder,
    private _router: Router) {
		this.orders$ = _orderController.orders$;
		this.products$ = _orderController.products$;
		this.total$ = _orderController.total$;

    this._successMessage$
    .pipe(
      takeUntilDestroyed(),
      tap((message) => (this.successMessage = message)),
      debounceTime(5000),
    )
    .subscribe(() => { 
      console.log(this.successMessageAlert);
      this.successMessageAlert?.close()
    });

    this._errorMessage$
    .pipe(
      takeUntilDestroyed(),
      tap((message) => (this.errorMessage = message)),
      debounceTime(5000),
    )
    .subscribe(() => { 
      console.log(this.errorMessageAlert);
      this.errorMessageAlert?.close()
    });

	}

  ngOnInit(): void {
    this._orderController.fetchProducts();

    this.buildBasicForm();
    localStorage.clear();
  }

  buildBasicForm() {
    this.newOrderForm = this._fb.group({
      product_id: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      destination: ['', [Validators.required]]
    });
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.newOrderProductSelect?.nativeElement.focus();
    },100); 

  }

  calculateOrderTotal() {
    let productId = this.newOrderForm.get("product_id")?.value;
    let quantity = this.newOrderForm.get("quantity")?.value;

    console.log("qty: " + quantity);
    if(quantity == "" || quantity == null || quantity == undefined) { return; }

    this.products$.forEach(products => {
      for(let i=0; i< products.length; i++) {
        let p : Product  = products[i];
        if(p.id == productId) {
          console.log("price is: " + p.price);
          let orderTotal = p.price * quantity;
          console.log("order total: " + orderTotal);
          this.orderTotal = orderTotal;
        }
      }
    });

    console.log("calculate: productId: " + productId + ", qty: " + quantity);
  }

  hasErrorMessage() : boolean {
    return this.errorMessage !== "";
  }

  hasSuccessMessage() : boolean {
    return this.successMessage !== "";
  }

  submitOrder() {
    this.errorMessage = '';

    let formWebOrder: WebOrder = this.newOrderForm.value;
    let customerName = this._authService.activeUser ? this._authService.activeUser.userName : "";

    let webOrder: WebOrder = {
      web_order_id: uuidv4(),
      order_date: new Date(),
      customer_name: customerName,
      destination: formWebOrder.destination,
      product_id: parseInt(formWebOrder.product_id.toString()),
      quantity: parseInt(formWebOrder.quantity.toString()),
    };

    console.log("sending web order:");
    console.log(webOrder);

    this._orderController.submitWebOrder(webOrder).subscribe({ 
      next: () => {
        console.log("submitted web order!");
        let msg = "Web Order <strong>#" + webOrder.web_order_id + "</strong> has been placed!";
        this._successMessage$.next(msg);
          },
      error: (error) => {
        console.error("submitting web order:" + error);
        console.log(error);
        let msg = "Error placing Web Order: " + error.toString();
        this._errorMessage$.next(msg);
      },
      complete: () => {
        console.log("web order submission complete!")
      }
    });
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

  numberOnly(event : any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }  
}

