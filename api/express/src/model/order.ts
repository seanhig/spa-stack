import {Entity, PrimaryGeneratedColumn, Column, Timestamp} from "typeorm";

@Entity({ name: "orders" })
export class Order {

    @PrimaryGeneratedColumn({name: 'order_id'})
    orderId: number;

    @Column({name: 'order_ref'})
    orderRef: string;

    @Column({name: 'order_date'})
    orderDate: Date;

    @Column({name: 'customer_name'})
    customerName: string;

    @Column({name: 'order_total'})
    orderTotal: number;
    
    @Column({name: 'order_qty'})
    orderQty: number;

    @Column({name: 'product_id'})
    productId: number;

    @Column({name: 'order_status'})
    orderStatus: number;
}