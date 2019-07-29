import { Router } from 'express';
import passport from 'passport';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';
import '../helpers/passportStrategies';

const {
  signUp,
  userSignin,
  logout,
  socialLogin,
} = AuthController;

const { verifyToken } = AuthMiddleware;

const router = Router();

router.post('/signup', Validate.signup, signUp);
router.post('/signin', userSignin);
router.post('/logout', verifyToken, logout);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), socialLogin);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), socialLogin);

export default router;
