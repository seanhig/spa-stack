
import { erpdbDataSource } from './config/erpdbDataSource'
import { shipdbDataSource } from './config/shipdbDataSource'
import { userdbDataSource } from './config/userdbDataSource'
import logger from './util/logger'

export default function initializeDataSources(callback : Function) {
    
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