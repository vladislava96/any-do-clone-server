import { Router } from 'express';
import userController from '../controller/userController';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/registration',
  [
    check('email', 'User email cannot be empty.').notEmpty(),
    check('email', 'Invalid email.').isEmail(),
    check('password', 'The password must be 8 characters long.').isLength({min: 8, max: 8})
  ],
  userController.registration
)
router.post('/login', userController.login);
router.post('/logout', userController.logout);

export default router;
