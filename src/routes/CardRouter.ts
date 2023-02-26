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
    router.get('/', controller.getAll);
    router.post('/', this.cardValidation(), controller.create);
    router.get('/:cardId', controller.getOne);
    router.put('/:cardId', this.cardValidation(), controller.update);
    router.delete('/:cardId', controller.delete);

    return router;
  }

  private cardValidation(): ValidationChain[] {
    return [
      body('columnId')
        .if(body('columnId').notEmpty())
          .isNumeric().withMessage('Column ID must be integer.'),
      body('title')
        .notEmpty().withMessage('Title is required.'),
      body('order')
        .notEmpty().isNumeric().withMessage('Order must be integer.')
    ];
  }
}