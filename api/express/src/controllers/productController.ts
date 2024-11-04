import express from 'express';
import { Product } from '../model/product';
import { erpdbDataSource } from '../orm';
import logger from '../util/logger';
import authorize from './authorizer';

let router = express.Router();

// Product

router.get('/', authorize, async function (req, res, next) {

    logger.info("Loading products...");
    const products = await erpdbDataSource.getRepository(Product).find({ take: 200 })
    res.send(products);

});

export default router;