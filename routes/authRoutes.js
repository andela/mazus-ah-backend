import { Router } from 'express';
import passport from 'passport';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';
import '../helpers/passportStrategies';

const {
  signUp,
  verifyEmail,
  userSignin,
  logout,
  socialLogin,
} = AuthController;

const router = Router();

const { verifyToken } = AuthMiddleware;


router.post('/signup', Validate.signup, signUp);
router.patch('/verify', verifyEmail);
router.post('/signin', userSignin);
router.post('/logout', verifyToken, logout);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), socialLogin);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), socialLogin);

export default router;
