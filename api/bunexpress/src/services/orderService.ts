import express, { type Request, type Response, type NextFunction } from 'express';
import { Order } from '../model/order';
import { erpdbDataSource } from '../orm';
import { Equal } from 'typeorm';
import authorize from './authorizer';
const logger = require('pino')()

let router = express.Router();

router.get('/', authorize, async function (req: Request, res: Response, next: NextFunction) {

    let query : any = {
        order: {
            orderDate: {
                name: "DESC"
            }
        },
        take: 200
    }

    if (req.query.customerName) {
        let customerName: string = req.query.customerName.toString();
        logger.info("Loading orders for: " + customerName);
        query.where = {
            customerName: Equal(customerName)
        };
    }     
    else {
        logger.info("Loading all orders...");
    }
    const orders = await erpdbDataSource.getRepository(Order).find(query)
    res.send(orders);

});

export default router;