import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/signup', AuthController.signUp);
router.patch('/verify', AuthController.verifyEmail);

export default router;
