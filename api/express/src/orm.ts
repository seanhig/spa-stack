
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