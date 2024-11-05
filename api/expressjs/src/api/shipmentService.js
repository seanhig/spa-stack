import express from 'express';
import db from '../db.js';
import logger from '../logger.js';
import authorize from './authorizer.js';

let router = express.Router();

router.get('/', async function (req, res, next) {

    logger.info("Loading shipments...");
    const results = await db.shipdbConnection.query(
        'SELECT * FROM SHIPMENTS ORDER BY shipment_id DESC LIMIT 200'
    );

    let shipments = [];
    results.rows.forEach(row => {
        shipments.push({
            shipmentId: row.shipment_id,
            orderId: row.order_id,
            origin: row.origin,
            destination: row.destination,
            hasArrived: row.has_arrived
        });
    })

    res.send(shipments)
});

export default router;