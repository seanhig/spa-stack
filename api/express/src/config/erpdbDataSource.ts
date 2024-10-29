
import { DataSource } from "typeorm"
import { Product } from '../model/product';
import { Order } from '../model/order';

export const erpdbDataSource = new DataSource({
    type: "mysql",
    host: "host.docker.internal",
    port: 3306,
    username: "root",
    password: "Fender2000",
    database: "erpdb",
    synchronize: false,
    logging: false,
    entities: [Product, Order],
})
