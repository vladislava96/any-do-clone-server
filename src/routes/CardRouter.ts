import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';
import CardController from '../controller/CardController';
import Authorization from '../Authorization';

export default class CardRouter {
  public constructor(
    private readonly client: PrismaClient,
    private readonly authorization: Authorization,
  ) {
  }

  public create(): Router {
    const controller = new CardController(this.client);
    const router = Router();

    router.use(this.authorization.createMiddleware());
    router.get('/cards/', controller.getAll);
    router.post('/cards/', this.cardValidation(), controller.create);
    router.get('/cards/:cardId', controller.getOne);
    router.put('/cards/:cardId', this.cardValidation(), controller.update);
    router.delete('/cards/:cardId', controller.delete);

    return router;
  }

  private cardValidation(): ValidationChain[] {
    return [
      body('columnId')
        .if(body('columnId').notEmpty())
          .isNumeric().withMessage('Column ID must be integer.'),
      body('title')
        .notEmpty().withMessage('Title is required.'),
    ];
  }
}