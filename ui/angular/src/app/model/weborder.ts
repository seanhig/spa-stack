export interface WebOrder {
	webOrderId: string;
	orderDate: Date;
	customerName: string;
	destination: string;
	quantity: number;
	productId: number;
}