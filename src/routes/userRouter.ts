import { Router } from 'express';
import userController from '../controller/userController';

const router = Router();

router.post('/user', userController.registration)

export default router;
