import { Shipment } from "../shared/model/shipment";

export const SHIPMENTS: Shipment[] = [
	{
		shipment_id: 101,
		order_id: 1001,
		origin: "Honalulu, Hawaii",
		destination: "Calgary, Alberta",
		is_arrived: false
	},
	{
		shipment_id: 102,
		order_id: 1002,
		origin: "Makiki, Hawaii",
		destination: "Calgary, Alberta",
		is_arrived: false
	},
	{
		shipment_id: 103,
		order_id: 1003,
		origin: "Tampa, Florida",
		destination: "Red Deer, Alberta",
		is_arrived: false
	},
]
