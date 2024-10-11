var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({ apiName: "This is ExpressJS!", version: "v1.0.0"});
});

module.exports = router;
