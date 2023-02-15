import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
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
    router.post('/', controller.create);
    router.get('/:projectId', controller.getOne);
    router.put('/:projectId', controller.update);
    router.delete('/:projectId', controller.delete);

    return router;
  }
}
