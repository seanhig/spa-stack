import express from 'express';
import db from '../db.js';
import logger from '../logger.js';
import authorize from './authorizer.js';

let router = express.Router();

function prepareOrderFormat(results) {
    let orders = [];
    results.forEach(row => {
        orders.push({
            orderId: row.order_id,
            orderRef: row.order_ref,
            orderDate: row.order_date,
            orderQty: row.order_qty,
            customerName: row.customer_name,
            productId: row.product_id,
            orderStatus: row.order_status,
            orderTotal: row.order_total
        })
    });
    return orders;
}

router.get('/', async function (req, res, next) {

    if(req.query.customerName !== undefined) {
        logger.info(`Loading orders for ${req.query.customerName}...`);
        db.erpdbConnection.query(`SELECT * FROM orders WHERE customer_name = '${req.query.customerName}'`, function (error, results, fields) {
            if (error != undefined) {
                logger.error("Error loading user orders", error);
                res.send(500);
            } else {
                res.send(prepareOrderFormat(results))    
            }
        });

    } else {
        logger.info("Loading all orders...");
        db.erpdbConnection.query('SELECT * FROM orders ORDER BY order_date DESC LIMIT 200', function (error, results, fields) {
            if (error != undefined) {
                logger.error("Error loading orders", error);
                res.send(500);
            } else {
                res.send(prepareOrderFormat(results))    
            }
        });
    
    }
    
});

export default router;