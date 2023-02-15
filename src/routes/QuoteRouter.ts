import { Router } from 'express';
import QuoteController from '../controller/QuoteController';

export default class QuoteRouter {
  public create(): Router {
    const quoteController = new QuoteController();
    const router = Router();

    router.get('/', quoteController.getAll);
    router.get('/random', quoteController.getRandom);
    
    return router;
  }
}
