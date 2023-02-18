import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';
import ColumnController from '../controller/ColumnController';
import Authorization from '../Authorization';


export default class ColumnRouter {
  public constructor(
    private readonly client: PrismaClient,
    private readonly authorization: Authorization,
  ) {
  }

  public create(): Router {
    const controller = new ColumnController(this.client);
    const router = Router();

    router.use(this.authorization.createMiddleware());
    router.get('/', controller.getAll);
    router.post('/', this.columnValidation(), controller.create);
    router.get('/:columnId', controller.getOne);
    router.put('/:columnId', this.columnValidation(), controller.update);
    router.delete('/:columnId', controller.delete);

    return router;
  }

  public columnValidation(): ValidationChain[] {
    return [
      body('title', 'Title is required.').notEmpty(),
    ];
  }
}