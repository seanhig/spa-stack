import "reflect-metadata"
import path from 'path'
import express from "express"
import { Express, Request, Response } from "express"
import dotenv from "dotenv"
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import logger from './util/logger'

import indexController from './controllers/indexController'
import aboutController from './controllers/aboutController'
import identityController from './controllers/identityController'
import orderController from './controllers/orderController'
import productController from './controllers/productController'
import shipmentController from './controllers/shipmentController'
import webOrderController from './controllers/webOrderController'

import morganMiddleware from './config/morganMiddleware'

import configurePassport from './passportjs';
import initializeDataSources from './orm';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8090;

app.use(express.json());
app.use(morganMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
secret: 'my-secret',
resave: false,
cookie: { secure: false },
saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(app);

initializeDataSources(() => {

    if(process.env.ENVIRONMENT?.toLowerCase() == "production") {
        // we'll script a copy of the .dist folder into public
        app.use(express.static(path.join(__dirname, 'public')));

        // these are the SPA routes to prevent Express from throwing a 404 on a browser refresh
        app.use('/site/home', express.static(path.join(__dirname, 'public')));
        app.use('/auth/signin', express.static(path.join(__dirname, 'public')));
        app.use('/user/my-orders', express.static(path.join(__dirname, 'public')));
        app.use('/admin/orders', express.static(path.join(__dirname, 'public')));
        app.use('/admin/products', express.static(path.join(__dirname, 'public')));
        app.use('/admin/shipments', express.static(path.join(__dirname, 'public')));
        
        logger.info("Hosting SPA at public root");
    }

    app.use('/api/about', aboutController);
    app.use('/api/identity', identityController);
    app.use('/api/product', productController);
    app.use('/api/order', orderController);
    app.use('/api/shipment', shipmentController);
    app.use('/api/weborders', webOrderController);

    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}`);
    });

    app.use((err: any, req: Request, res: Response, next: Function) => {

        let msg : string = `ExpressJS Server Error: ${err.message}`;
        let httpCode: number = 500;

        if(err.name == "AuthError") {
            httpCode = 401;
        } else {
            logger.error(msg, err);
            console.error(err);            
        }
        logger.warn(`returning a ${httpCode}`);
        res.status(httpCode).send(msg);    

    });
});





