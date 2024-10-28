import express from 'express';

var router = express.Router();

// Shipment

router.get('/', function(req, res, next) {
  res.send([{}]);
});

export default router;