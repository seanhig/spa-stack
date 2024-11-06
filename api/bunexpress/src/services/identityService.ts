import express from 'express'
import passport from 'passport'
import logger from '../logger'
import authorize from './authorizer'

let router = express.Router();

// Identity

router.get('/current-user', function (req, res, next) {
    if (req.user) {
        logger.info("There is a request user!");
        console.log(req.user);
        res.send(req.user);
    } else {
        logger.info("There is no request user.");
        res.send({ userName: null, email: null });
    }
});

router.post('/external-login', function (req, res, next) {
    if (req.query.provider.toString().toLowerCase() == "google") {
        logger.info("authenticating with Google");
        passport.authenticate('google', {
            session: false,
            successRedirect: '/',
            failureRedirect: '/auth/signin'
        })(req, res, next);
    } else if (req.query.provider.toString().toLowerCase() == "microsoft") {
        passport.authenticate('microsoft', { session: false })(req, res, next);
    } else {
        logger.error("uknown authentication provider: " + req.query.provider);
    }
});

// TODO: real logouts
router.post('/external-logout', function (req, res, next) {
    res.send(200);
});

router.post('/logout', function (req, res, next) {
    res.send(200);
});

export default router;