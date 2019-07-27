import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';

const { signUp, logout } = AuthController;
const { verifyToken } = AuthMiddleware;

const router = Router();

router.post('/signup', Validate.signup, signUp);
router.post('/logout', verifyToken, logout);


export default router;
