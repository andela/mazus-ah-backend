import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';

const router = Router();

router.post('/signup', AuthController.signUp);
router.patch('/verify', AuthController.verifyEmail);
const { signUp, logout } = AuthController;
const { verifyToken } = AuthMiddleware;


router.post('/signup', Validate.signup, signUp);
router.post('/logout', verifyToken, logout);


export default router;
