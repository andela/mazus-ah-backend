import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';

const router = Router();

const {
  signUp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout
} = AuthController;
const { verifyToken } = AuthMiddleware;
const { resetforgotPassword, resetemail } = Validate;


router.post('/signup', Validate.signup, signUp);
router.patch('/verify', verifyEmail);
router.post('/forgotpassword', resetemail, forgotPassword);
router.patch('/resetpassword/:token', resetforgotPassword, resetPassword);
router.post('/logout', verifyToken, logout);


export default router;
