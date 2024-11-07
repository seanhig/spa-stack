
import { DataSource } from "typeorm"
import { Product } from './model/product';
import { Order } from './model/order';
import { Shipment } from './model/shipment';
import { User } from './model/user';

//import logger from './logger'
const logger = require('pino')()

export let erpdbDataSource : DataSource;
export let shipdbDataSource : DataSource;
export let userdbDataSource : DataSource;

export default async function initializeDataSources() {
    return new Promise<void>(async (resolve, reject) => {

        try {
            erpdbDataSource = new DataSource({
                type: "mysql",
                url: process.env.ERPDB_URL,
                synchronize: false,
                logging: false,
                entities: [Product, Order],
            })
            
            shipdbDataSource = new DataSource({
                type: "postgres",
                url: process.env.SHIPDB_URL,
                synchronize: false,
                logging: false,
                entities: [Shipment],
            })
            
            userdbDataSource = new DataSource({
                type: "mysql",
                url: process.env.USERDB_URL,
                synchronize: false,
                logging: false,
                entities: [User],
            })
            
            await erpdbDataSource.initialize();
            logger.info("[erpDB] Data Source has been initialized!");
            await shipdbDataSource.initialize();
            logger.info("[shipDB] Data Source has been initialized!");
            await userdbDataSource.initialize();
            logger.info("[userDB] Data Source has been initialized!");
            resolve();

        } catch(ex) {
            logger.error("Error during Data Source initialization:", ex)
            reject(ex);
        }
    });
}