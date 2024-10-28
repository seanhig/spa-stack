import "reflect-metadata";
import path from 'path';
import express from "express";
import { Express, Request, Response } from "express";
import dotenv from "dotenv";
import logger from './util/logger';

import aboutController from './controllers/aboutController';
import identityController from './controllers/identityController';
import orderController from './controllers/orderController';
import productController from './controllers/productController';
import shipmentController from './controllers/shipmentController';
import webOrderController from './controllers/webOrderController';

import morganMiddleware from './config/morganMiddleware'
import { erpdbDataSource } from './config/erpdbDataSource';

dotenv.config();

erpdbDataSource
    .initialize()
    .then(() => {
        logger.info("[erpDB] Data Source has been initialized!")
    })
    .catch((err) => {
        logger.error("Error during erpDB Data Source initialization:", err)
    })

const app: Express = express();
const port = process.env.PORT || 8090;

app.use(express.json());
app.use(morganMiddleware);
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));

// for prod
//app.use('/', express.static('../../.dist/app/browser'))
//app.use('/', indexController);

app.use('/api/about', aboutController);
app.use('/api/identity', identityController);
app.use('/api/product', productController);
app.use('/api/order', orderController);
app.use('/api/shipment', shipmentController);
app.use('/api/weborders', webOrderController);

app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
});


