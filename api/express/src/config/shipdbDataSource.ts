
import { DataSource } from "typeorm"
import { Shipment } from '../model/shipment';

export const shipdbDataSource = new DataSource({
    type: "postgres",
    host: "host.docker.internal",
    port: 5432,
    username: "postgres",
    password: "Fender2000",
    database: "shipdb",
    synchronize: false,
    logging: false,
    entities: [Shipment],
})
