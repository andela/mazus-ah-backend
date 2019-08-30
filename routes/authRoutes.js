import { Router } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';
import '../helpers/passportStrategies';

dotenv.config();

const {
  signUp,
  userSignin,
  logout,
  socialLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = AuthController;

const { verifyToken } = AuthMiddleware;
const { resetforgotPassword, validateEmail } = Validate;

const router = Router();

router.post('/signup', Validate.signup, signUp);
router.get('/verify', verifyEmail);
router.post('/signin', Validate.signin, userSignin);
router.post('/logout', verifyToken, logout);


router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  socialLogin
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  socialLogin
);

router.post('/forgotpassword', validateEmail, forgotPassword);
router.patch('/resetpassword/:token', resetforgotPassword, resetPassword);
export default router;
