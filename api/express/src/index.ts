import "reflect-metadata"
import path from 'path'
import express from "express"
import { Express, Request, Response } from "express"
import dotenv from "dotenv"
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import OAuth2Strategy from 'passport-oauth2'
import Google from 'passport-google-oidc'
import Microsoft from 'passport-microsoft'

import logger from './util/logger'

import aboutController from './controllers/aboutController'
import identityController from './controllers/identityController'
import orderController from './controllers/orderController'
import productController from './controllers/productController'
import shipmentController from './controllers/shipmentController'
import webOrderController from './controllers/webOrderController'

import morganMiddleware from './config/morganMiddleware'
import { erpdbDataSource } from './config/erpdbDataSource'
import { shipdbDataSource } from './config/shipdbDataSource'
import { userdbDataSource } from './config/userdbDataSource'

var GoogleStrategy = Google.Strategy;
var MicrosoftStrategy = Microsoft.Strategy;

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

configurePassport();

initializeDataSources(() => {

    // for prod
    //app.use(express.static(path.join(__dirname, 'public')));
    //app.use('/', express.static('../../.dist/app/browser'))
    //app.use('/', indexController);

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
        console.error(err.stack);
        res.status(500).send('An error occurred');
    });
});

// PassportJS Related
app.get('/api/oauth2/callback/google', 
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/auth/signin',
}));

app.get('/api/oauth2/callback/microsoft', 
    passport.authenticate('microsoft', {
        successRedirect: '/',
        failureRedirect: '/auth/signin',
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

function configurePassport() {

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLECLIENTID,
            clientSecret: process.env.GOOGLECLIENTSECRET,
            callbackURL: "http://localhost:4200/api/oauth2/callback/google",
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
              ]
        },
        function(source, profile, done) {

            logger.info("Google auth success: ");
            logger.info("source: " + source);
            console.log(profile);

            logger.info("id: " + profile.id);
            logger.info("displayName: " + profile.displayName);
            logger.info("familyName: " + profile.name.familyName);
            logger.info("givenName: " + profile.name.givenName);
            logger.info("email0: " + profile.emails[0].value);

            // do DB User lookup stuff here

            return done(null, { 
                id: profile.id, 
                userName: profile.emails[0].value, 
                email: profile.emails[0].value, 
                firstName: profile.name.givenName,
                lastName: profile.name.familyName 
            });

        }
    ));
    logger.info("Registered passport google strategy");

    passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFTCLIENTID,
        clientSecret: process.env.MICROSOFTCLIENTSECRET,
        callbackURL: "http://localhost:4200/api/oauth2/callback/microsoft",
        scope: ['user.read']
      },
      function(accessToken, refreshToken, profile, done) {

            logger.info("Microsoft auth success: ");
            console.log(profile);

            logger.info("id: " + profile.id);
            logger.info("displayName: " + profile.displayName);
            logger.info("familyName: " + profile.name.familyName);
            logger.info("givenName: " + profile.name.givenName);
            logger.info("email0: " + profile.emails[0].value);

            // do DB User lookup stuff here

            return done(null, { 
                id: profile.id, 
                userName: profile.emails[0].value, 
                email: profile.emails[0].value, 
                firstName: profile.name.givenName,
                lastName: profile.name.familyName 
            });

        }
    ));
    logger.info("Registered passport microsoft strategy");
}

// TypeORM Initialization

function initializeDataSources(callback : Function) {
    
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



