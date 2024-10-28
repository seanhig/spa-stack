import express from 'express';

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({ apiName: "This is ExpressJS!", version: "v1.0.0"});
});

export default router;