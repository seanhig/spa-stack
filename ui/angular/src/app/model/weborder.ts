export interface WebOrder {
	web_order_id: string;
	order_date: Date;
	customer_name: string;
	destination: string;
	quantity: number;
	product_id: number;
}