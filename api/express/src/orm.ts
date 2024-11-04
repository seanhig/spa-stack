
import { DataSource } from "typeorm"
import { Product } from './model/product';
import { Order } from './model/order';
import { Shipment } from './model/shipment';
import { User } from './model/user';

import logger from './util/logger'

export let erpdbDataSource : DataSource = undefined;
export let shipdbDataSource : DataSource = undefined;
export let userdbDataSource : DataSource = undefined;

export default function initializeDataSources(callback : Function) {
    
    erpdbDataSource = new DataSource({
        type: "mysql",
        host: process.env.ERPDB_HOST,
        port: parseInt(process.env.ERPDB_PORT),
        username: process.env.ERPDB_USER,
        password: process.env.ERPDB_PASSWORD,
        database: process.env.ERPDB_DATABASE,
        synchronize: false,
        logging: false,
        entities: [Product, Order],
    })
    
    shipdbDataSource = new DataSource({
        type: "postgres",
        host: process.env.SHIPDB_HOST,
        port: parseInt(process.env.SHIPDB_PORT),
        username: process.env.SHIPDB_USER,
        password: process.env.SHIPDB_PASSWORD,
        database: process.env.SHIPDB_DATABASE,
        synchronize: false,
        logging: false,
        entities: [Shipment],
    })
    
    userdbDataSource = new DataSource({
        type: "mysql",
        host: process.env.USERDB_HOST,
        port: parseInt(process.env.USERDB_PORT),
        username: process.env.USERDB_USER,
        password: process.env.USERDB_PASSWORD,
        database: process.env.USERDB_DATABASE,
        synchronize: false,
        logging: false,
        entities: [User],
    })
    
    erpdbDataSource
    .initialize()
    .then(() => {
        logger.info("[erpDB] Data Source has been initialized!")
        return shipdbDataSource.initialize();
    })
    .then(() => {
        logger.info("[shipDB] Data Source has been initialized!")
        return userdbDataSource.initialize();
    })
    .then(() => {
        logger.info("[userDB] Data Source has been initialized!")
        callback();
    })
    .catch((err) => {
        logger.error("Error during erpDB Data Source initialization:", err)
        throw err;
    })
}