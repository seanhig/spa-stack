import { Express, Request, Response } from "express"
import passport from 'passport'
import Google from 'passport-google-oidc'
import Microsoft from 'passport-microsoft'
import logger from './util/logger'

var GoogleStrategy = Google.Strategy;
var MicrosoftStrategy = Microsoft.Strategy;

export default function configurePassport(app: Express) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLECLIENTID,
        clientSecret: process.env.GOOGLECLIENTSECRET,
        callbackURL: "http://localhost:4200/api/oauth2/callback/google",
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    },
        function (source, profile, done) {

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
    logger.info("Registered Google passport strategy");

    passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFTCLIENTID,
        clientSecret: process.env.MICROSOFTCLIENTSECRET,
        callbackURL: "http://localhost:4200/api/oauth2/callback/microsoft",
        scope: ['user.read']
    },
        function (accessToken, refreshToken, profile, done) {

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
    logger.info("Registered Microsoft passport strategy");

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

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
    
    
}