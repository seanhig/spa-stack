import express from 'express';
import logger from '../logger'
import { Order } from '../model/order';
import { erpdbDataSource } from '../orm';
import { Equal } from 'typeorm';
import authorize from './authorizer';

let router = express.Router();

// Order

router.get('/', authorize, async function (req, res, next) {

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