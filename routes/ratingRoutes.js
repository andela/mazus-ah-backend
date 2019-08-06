import { Router } from 'express';
import AuthMiddleware from '../middlewares/Authentication';
import RatingController from '../controllers/RatingController';
import Validate from '../middlewares/inputValidation';

const { verifyToken, verifiedUserOnly } = AuthMiddleware;
const { getArticleRatings } = RatingController;
const {
  userRating
} = RatingController;

const router = Router();

router.get('/:slug/ratings', getArticleRatings);

router.post('/:slug/ratings', verifyToken, verifiedUserOnly, Validate.validateRate, userRating);

export default router;
