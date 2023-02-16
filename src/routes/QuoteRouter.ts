import { Router } from 'express';
import QuoteController from '../controller/QuoteController';

export default class QuoteRouter {
  public create(): Router {
    const quoteController = new QuoteController();
    const router = Router();

    router.get('/quotes/', quoteController.getAll);
    router.get('/quotes/random', quoteController.getRandom);
    
    return router;
  }
}
