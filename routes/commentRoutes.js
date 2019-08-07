import { Router } from 'express';
import CommentController from '../controllers/CommentController';
import AuthMiddleware from '../middlewares/Authentication';

const router = Router();
const { likeComment } = CommentController;

const { verifyToken, verifiedUserOnly } = AuthMiddleware;

router.post('/likes/:commentId', verifyToken, verifiedUserOnly, likeComment);

export default router;
