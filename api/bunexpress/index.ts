import "reflect-metadata"
import express, { type Request, type Response, type NextFunction, type Express } from 'express';
import path from 'path'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import figlet from 'figlet'

import aboutService from './src/services/aboutService'
import identityService from './src/services/identityService'
import orderService from './src/services/orderService'
import productService from './src/services/productService'
import shipmentService from './src/services/shipmentService'
import webOrderService from './src/services/webOrderService'

import initializeDataSources from './src/orm'
import configurePassport from './src/passportjs'
import { kafkaService } from './src/kafka'
import morganConfig from './src/morganConfig'
import logger from './src/logger'

const app: Express = express();
const port = process.env.PORT || 8090;

app.use(express.json());
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

await configurePassport(app);
await initializeDataSources();
await kafkaService.initialize();

if (process.env.SPASTACK_ENV?.toLowerCase() == "production") {

    // better to rely on the api gateway for request metrics capture,
    // so I probably would leave http logging OFF in production
    // but if we are going to use it, we'll use the structured form
    if(process.env.HTTP_LOGGING) {
        // use pino structured http request logging in production
        const pinoHttp = require('pino-http')()
        app.use(pinoHttp);
    }

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
} else {
    // use morgan http logging in dev for pretty print easy to read
    // until we can sort out the recipe for pino
    app.use(morganConfig);
}

app.use('/api/about', aboutService);
app.use('/api/identity', identityService);
app.use('/api/product', productService);
app.use('/api/order', orderService);
app.use('/api/shipment', shipmentService);
app.use('/api/weborders', webOrderService);

let bannerText = await figlet.text("SpaStack", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
console.log(bannerText);
  
app.listen(port, () => {
    logger.warn(`Server is running at http://localhost:${port}`);
});

app.use((err: any, req: Request, res: Response, next: Function) => {

    let msg: string = `ExpressJS Server Error: ${err.message}`;
    let httpCode: number = 500;

    if (err.name == "AuthError") {
        httpCode = 401;
    } else {
        logger.error(msg, err);
        console.error(err);
    }
    logger.warn(`returning a ${httpCode}`);
    res.status(httpCode).send(msg);
});


