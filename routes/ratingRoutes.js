import { Router } from 'express';
import RatingController from '../controllers/RatingController';

const { getArticleRatings } = RatingController;
const router = Router();

router.get('/:slug/ratings', getArticleRatings);

export default router;
