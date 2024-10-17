import { Shipment } from "../model/shipment";

export const SHIPMENTS: Shipment[] = [
	{
		shipmentId: 101,
		orderId: 1001,
		origin: "Honalulu, Hawaii",
		destination: "Calgary, Alberta",
		hasArrived: false
	},
	{
		shipmentId: 102,
		orderId: 1002,
		origin: "Makiki, Hawaii",
		destination: "Calgary, Alberta",
		hasArrived: false
	},
	{
		shipmentId: 103,
		orderId: 1003,
		origin: "Tampa, Florida",
		destination: "Red Deer, Alberta",
		hasArrived: false
	},
]
