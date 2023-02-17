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
    router.get('/projects/', controller.getAll);
    router.post('/projects/', this.projectValidation(), controller.create);
    router.get('/projects/:projectId', controller.getOne);
    router.put('/projects/:projectId', this.projectValidation(), controller.update);
    router.delete('/projects/:projectId', controller.delete);

    return router;
  }

  public projectValidation(): ValidationChain[] {
    return [
      body('name', 'Name is required.').notEmpty(),
    ];
  }
}
