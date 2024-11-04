import express from 'express';
import { Shipment } from '../model/shipment';
import { shipdbDataSource } from '../orm';
import logger from '../util/logger';
import authorize from './authorizer';

let router = express.Router();

// Shipment

router.get('/', authorize, async function (req, res, next) {

  logger.info("Loading shipments...");
  const shipments = await shipdbDataSource.getRepository(Shipment).find({ take: 200 })
  res.send(shipments);

});

export default router;