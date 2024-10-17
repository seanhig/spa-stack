export interface Order {
	orderId: number;
	orderRef: string;
	orderDate: Date;
	customerName: string;
	orderTotal: number;
	orderQty: number;
	productId: number;
    orderStatus: number;
}