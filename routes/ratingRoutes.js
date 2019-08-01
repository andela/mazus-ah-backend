import { Router } from 'express';
import AuthMiddleware from '../middlewares/Authentication';
import RatingController from '../controllers/RatingController';

const { verifyToken } = AuthMiddleware;
const { getArticleRatings } = RatingController;
const router = Router();

router.get('/:slug/ratings', verifyToken, getArticleRatings);

export default router;
