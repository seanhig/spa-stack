import express, { type Request, type Response, type NextFunction } from 'express';
import { type WebOrder, kafkaService } from '../kafka'
import authorize from './authorizer';

const logger = require('pino')()

let router = express.Router();

router.post('/', authorize, async function(req: Request, res: Response, next: NextFunction) {

  const webOrder: WebOrder = { 
    web_order_id: req.body.web_order_id,
    order_date: Date.now(),
    customer_name: req.body.customer_name,
    destination: req.body.destination,
    product_id: parseInt(req.body.product_id),
    quantity: parseInt(req.body.quantity)
  }

  await kafkaService.submitWebOrder(webOrder);
  res.send(webOrder);

});

export default router;