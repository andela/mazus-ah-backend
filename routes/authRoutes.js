import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const { signUp, verifyEmail } = AuthController;

const router = Router();

router.post('/signup', signUp);
router.patch('/verify', verifyEmail);

export default router;
