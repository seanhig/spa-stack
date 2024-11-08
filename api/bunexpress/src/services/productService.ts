import express, { type Request, type Response, type NextFunction } from 'express';
import { Product } from '../model/product';
import { erpdbDataSource } from '../orm';
import authorize from './authorizer';
import logger from '../logger'

let router = express.Router();

router.get('/', authorize, async function (req: Request, res: Response, next: NextFunction) {

    logger.info("Loading products...");
    const products = await erpdbDataSource.getRepository(Product).find({ take: 200 })
    res.send(products);

});

export default router;