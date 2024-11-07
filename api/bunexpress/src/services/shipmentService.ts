import express, { type Request, type Response, type NextFunction } from 'express';
import { Shipment } from '../model/shipment';
import { shipdbDataSource } from '../orm';
import authorize from './authorizer';
const logger = require('pino')()

let router = express.Router();

router.get('/', authorize, async function (req: Request, res: Response, next: NextFunction) {

  logger.info("Loading shipments...");
  const shipments = await shipdbDataSource.getRepository(Shipment).find({ take: 200 })
  res.send(shipments);

});

export default router;