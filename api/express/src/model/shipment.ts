import {Entity, PrimaryGeneratedColumn, Column, Timestamp} from "typeorm";

@Entity({ name: "shipments" })
export class Shipment {

    @PrimaryGeneratedColumn({name: 'shipment_id'})
    shipmentId: number;

    @Column({name: 'order_id'})
    orderId: number;

    @Column()
    origin: string;

    @Column()
    destination: string;

    @Column({name: 'has_arrived'})
    hasArrived: boolean;
}