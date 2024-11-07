import express from 'express';
import { Product } from '../model/product';
import { erpdbDataSource } from '../orm';
import authorize from './authorizer';
const logger = require('pino')()

let router = express.Router();

router.get('/', authorize, async function (req, res, next) {

    logger.info("Loading products...");
    const products = await erpdbDataSource.getRepository(Product).find({ take: 200 })
    res.send(products);

});

export default router;