import express from 'express';

var router = express.Router();

// Identity

router.get('/current-user', function(req, res, next) {
  res.send({ userName: null, email: null });
});

router.post('/external-login', function(req, res, next) {

});

router.post('/logout', function(req, res, next) {

});

export default router;