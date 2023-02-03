import { Router } from 'express';
import userController from '../controller/userController';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/registration',
  [
    check('email', 'User email cannot be empty.').notEmpty(),
    check('password', 'The password must be more than 4 and less than 10 characters.').isLength({min: 4, max: 10})
  ],
  userController.registration
)
router.post('/login', userController.login);
router.post('/logout', userController.logout);

export default router;
