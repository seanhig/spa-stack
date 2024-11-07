import express, { type Request, type Response, type NextFunction } from 'express';

let router = express.Router();

router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Express' });
});

export default router;