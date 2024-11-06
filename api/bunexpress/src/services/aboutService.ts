import express from 'express';

let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({ apiName: "ExpressJS and TypeScript", version: "v1.0.0"});
});

export default router;