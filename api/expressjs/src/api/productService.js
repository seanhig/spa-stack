import express from 'express';
import db from '../db.js';
import logger from '../logger.js';
import authorize from './authorizer.js';

let router = express.Router();

router.get('/', async function (req, res, next) {

    logger.info("Loading products...");
    db.erpdbConnection.query('SELECT * from products', function (error, results, fields) {
        if (error != undefined) {
            logger.error("Error loading products", error);
            res.send(500);
        } else {
            res.send(results)    
        }
    });

});

export default router;