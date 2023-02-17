import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { body } from 'express-validator';
import Authorization from '../Authorization';
import UserController from '../controller/UserController';

export default class UserRouter {
  public constructor(
    private readonly client: PrismaClient,
    private readonly authorization: Authorization,
  ) {
  }

  public create(): Router {
    const userController = new UserController(this.client);
    const router = Router();
    
    router.post(
      '/registration',
      [
        body('email')
          .notEmpty().withMessage('User email cannot be empty.').bail()
          .isEmail().withMessage('Invalid email.'),
        body('password', 'The password must be more than 8 characters long.').isLength({min: 8})
      ],
      userController.registration
    )
    router.post('/login', userController.login);
    router.post('/logout', this.authorization.createMiddleware(), userController.logout);
    router.get('/users', this.authorization.createMiddleware(), userController.getUsers);
    
    return router
  }
};
