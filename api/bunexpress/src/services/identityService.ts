import express, { type Request, type Response, type NextFunction, type Express } from 'express';
import passport from 'passport'
import authorize from './authorizer'
const logger = require('pino')()

let router = express.Router();

router.get('/current-user', function (req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        logger.info("There is a request user!");
        console.log(req.user);
        res.send(req.user);
    } else {
        logger.info("There is no request user.");
        res.send({ userName: null, email: null });
    }
});

router.post('/external-login', function (req: Request, res: Response, next: NextFunction) {
    if (req.query.provider?.toString().toLowerCase() == "google") {
        logger.info("authenticating with Google");
        passport.authenticate('google', {
            session: false,
            successRedirect: '/',
            failureRedirect: '/auth/signin'
        })(req, res, next);
    } else if (req.query.provider?.toString().toLowerCase() == "microsoft") {
        passport.authenticate('microsoft', { session: false })(req, res, next);
    } else {
        logger.error("uknown authentication provider: " + req.query.provider);
    }
});

// TODO: real logouts
router.post('/external-logout', function (req: Request, res: Response, next: NextFunction) {
    res.send(200);
});

router.post('/logout', function (req: Request, res: Response, next: NextFunction) {
    res.send(200);
});

export default router;