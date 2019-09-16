import { Router } from 'express';
import CommentController from '../controllers/CommentController';
import AuthMiddleware from '../middlewares/Authentication';
import commentValidate from '../middlewares/commentValidations';

const router = Router();
const { likeComment, editComment, getArticleComments } = CommentController;
const { verifyToken, verifiedUserOnly } = AuthMiddleware;

router.post('/likes/:commentId', verifyToken, verifiedUserOnly, likeComment);
router.patch('/:commentId', verifyToken, verifiedUserOnly, commentValidate.comment, editComment);
router.get('/:articleId', getArticleComments);


export default router;
