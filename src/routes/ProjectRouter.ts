import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { body, ValidationChain } from 'express-validator';
import Authorization from '../Authorization';
import ProjectController from '../controller/ProjectController';

export default class ProjectRouter {
  public constructor(
    private readonly client: PrismaClient,
    private readonly authorization: Authorization,
  ) {
  }

  public create(): Router {
    const controller = new ProjectController(this.client);
    const router = Router();

    router.use(this.authorization.createMiddleware());
    router.get('/', controller.getAll);
    router.post('/', this.projectValidation(), controller.create);
    router.get('/:projectId', controller.getOne);
    router.put('/:projectId', this.projectValidation(), controller.update);
    router.delete('/:projectId', controller.delete);

    return router;
  }

  public projectValidation(): ValidationChain[] {
    return [
      body('name', 'Name is required.').notEmpty(),
    ];
  }
}
