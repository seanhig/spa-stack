import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ name: "products" })
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;
    
}