export interface Shipment {
	shipmentId: number;
	orderId: number;
	origin: string;
	destination: string;
	hasArrived: boolean;
}