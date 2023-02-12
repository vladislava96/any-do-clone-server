import { Router } from 'express';
import quoteController from '../controller/quoteController';

const router = Router();

router.get('/', quoteController.getAll);
router.get('/random', quoteController.getRandom);

export default router;