
import { DataSource } from "typeorm"
import { User } from '../model/user';

export const userdbDataSource = new DataSource({
    type: "mysql",
    host: "host.docker.internal",
    port: 3306,
    username: "root",
    password: "Fender2000",
    database: "spa_stack",
    synchronize: false,
    logging: false,
    entities: [User],
})
