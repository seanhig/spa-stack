import express from 'express';
import logger from '../util/logger'
import { Order } from '../model/order';
import { erpdbDataSource } from '../config/erpdbDataSource';
import { Equal } from 'typeorm';

var router = express.Router();

// Order

router.get('/', async function (req, res, next) {

  if(req.query.customerName) {
    var customerName : string = req.query.customerName.toString();
    logger.info("Loading orders for: " + customerName);

    const myorders = await erpdbDataSource.getRepository(Order).find({
      where: {
        customerName: Equal(customerName)
      },
      take: 200
    })
    res.send(myorders);  

  } else {
    logger.info("Loading all orders...");
    const orders = await erpdbDataSource.getRepository(Order).find({ take: 200 })
    res.send(orders);  
  }

});

export default router;