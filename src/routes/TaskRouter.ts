import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';
import TaskController from '../controller/TaskController';
import Authorization from '../Authorization';

export default class TaskRouter {
  public constructor(
    private readonly client: PrismaClient,
    private readonly authorization: Authorization,
  ) {
  }

  public create(): Router {
    const controller = new TaskController(this.client);
    const router = Router();

    router.use(this.authorization.createMiddleware());
    router.get('/', controller.getAll);
    router.post('/', this.taskValidation(), controller.create);
    router.get('/:taskId', controller.getOne);
    router.put('/:taskId', this.taskValidation(), controller.update);
    router.delete('/:taskId', controller.delete);

    return router;
  }

  private taskValidation(): ValidationChain[] {
    return [
      body('projectId')
        .if(body('projectId').notEmpty())
          .isNumeric().withMessage('Project ID must be integer.'),
      body('status')
        .notEmpty().withMessage('Status is required.'),
      body('performDate')
        .notEmpty().withMessage('Perform date is required.').bail()
        .isISO8601().withMessage('Perform date must be date.'),
      body('title')
        .notEmpty().withMessage('Title is required.'),
    ];
  }
}