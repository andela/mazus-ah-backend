import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const { signUp } = AuthController;

const router = Router();

router.post('/signup', signUp);

export default router;
