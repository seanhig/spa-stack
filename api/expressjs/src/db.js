//import mysql from 'mysql2/promise';
import mysql from 'mysql'
import pg from 'pg'
import pgParse from 'pg-connection-string'
import logger from './logger.js'

const { Client } = pg

const mysqlConnection = (name, connectionString) => {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(connectionString);
        connection.connect(function(err) {
        if (err) {
            logger.error("Error initializing db: " + name );
            reject(err);

        } else {
            logger.info(name + " Datasource initialized");
            resolve(connection);            
        }           
    });
  });
}

const db = {
    erpdbConnection: undefined,
    shipdbConnection: undefined,
    userdbConnection: undefined,
    async initializeConnections() {

        const pgURL = process.env.SHIPDB_URL;

        this.erpdbConnection = await mysqlConnection("ErpDB", process.env.ERPDB_URL);

        let config = pgParse.parse(pgURL)
        this.shipdbConnection = new Client(config);
        await this.shipdbConnection.connect();
        logger.info("ShipDB Datasource initialized");

        this.userdbConnection = await mysqlConnection("UserDB", process.env.USERDB_URL);
    }
}

export default db;