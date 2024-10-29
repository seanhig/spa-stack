import express from 'express';
import { Shipment } from '../model/shipment';
import { shipdbDataSource } from '../config/shipdbDataSource';
import logger from '../util/logger';

var router = express.Router();

// Shipment

router.get('/', async function (req, res, next) {

  logger.info("Loading shipments...");
  const shipments = await shipdbDataSource.getRepository(Shipment).find({ take: 200 })
  res.send(shipments);

});

export default router;