export interface Order {
	order_id: number;
	order_ref: string;
	order_date: Date;
	customer_name: string;
	order_total: number;
	order_qty: number;
	product_id: number;
    order_status: number;
}