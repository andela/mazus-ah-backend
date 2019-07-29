import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';

const router = Router();

const {
  signUp, verifyEmail, userSignin, logout
} = AuthController;
const { verifyToken } = AuthMiddleware;


router.post('/signup', Validate.signup, signUp);
router.patch('/verify', verifyEmail);
router.post('/signin', userSignin);
router.post('/logout', verifyToken, logout);


export default router;
