import express from 'express';
import { Product } from '../model/product';
import { erpdbDataSource } from '../config/erpdbDataSource';
import logger from '../util/logger';

var router = express.Router();

// Product

router.get('/', async function (req, res, next) {

    logger.info("Loading products...");
    const products = await erpdbDataSource.getRepository(Product).find({ take: 200 })
    res.send(products);

});

export default router;