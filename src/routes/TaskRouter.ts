import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { body, check, ValidationChain } from 'express-validator';
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
    router.get('/tasks/', controller.getAll);
    router.post('/tasks/', this.taskValidation(), controller.create);
    router.get('/tasks/:taskId', controller.getOne);
    router.put('/tasks/:taskId', this.taskValidation(), controller.update);
    router.delete('/tasks/:taskId', controller.delete);

    return router;
  }

  private taskValidation(): ValidationChain[] {
    return [
      body('projectId')
        .if(body('projectId').notEmpty())
          .isNumeric().withMessage('Project ID must be integer.'),
      check('status')
        .notEmpty().withMessage('Status is required.'),
      check('performDate')
        .notEmpty().withMessage('Perform date is required.').bail()
        .isISO8601().withMessage('Perform date must be date.'),
      check('title')
        .notEmpty().withMessage('Title is required.'),
    ];
  }
}