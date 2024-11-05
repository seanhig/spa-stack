import path from 'path'
import express from "express"
import dotenv from "dotenv"
import passport from 'passport'
import session from 'express-session'
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url';

import logger from './src/logger.js'
import morgan from './src/morgan.js'

import configurePassport from './src/passportjs.js';
import db from './src/db.js';

import aboutService from './src/api/aboutService.js'
import identityService from './src/api/identityService.js'
import orderService from './src/api/orderService.js'
import productService from './src/api/productService.js'
import shipmentService from './src/api/shipmentService.js'
import webOrderService from './src/api/webOrderService.js'

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

dotenv.config();

const app = express();
const port = process.env.PORT || 8090;

app.use(express.json());
app.use(morgan);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cookieSession({
    name: 'session',
    keys: ['somesecretkey'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }));


// stub functions to make the latest passportjs 
// work with cookieSession
const regenerate = callback => {
	console.log('regenerating passport stub')
	callback()
}
const save = callback => {
	console.log('saving passport stub')
	callback()
}
app.use((req, res, next)=>{
	req.session.regenerate = regenerate
	req.session.save = save
	next()
})

app.use(passport.initialize());
app.use(passport.session());

configurePassport(app);

await db.initializeConnections();

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

app.use('/api/about', aboutService);
app.use('/api/identity', identityService);
app.use('/api/product', productService);
app.use('/api/order', orderService);
app.use('/api/shipment', shipmentService);
app.use('/api/weborders', webOrderService);

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});

app.use((err, req, res, next) => {

    let msg = `ExpressJS Server Error: ${err.message}`;
    let httpCode = 500;

    if(err.name == "AuthError") {
        httpCode = 401;
    } else {
        logger.error(msg, err);
        console.error(err);            
    }
    logger.warn(`returning a ${httpCode}`);
    res.status(httpCode).send(msg);    

});