export interface Shipment {
	shipment_id: number;
	order_id: number;
	origin: string;
	destination: string;
	is_arrived: boolean;
}