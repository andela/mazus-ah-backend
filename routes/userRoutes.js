import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import AuthMiddleware from '../middlewares/Authentication';
import Validation from '../middlewares/inputValidation';

const {
  getAuthorOwnArticles,
  getAllBookmark
} = ArticleController;
const { verifyToken } = AuthMiddleware;

const router = Router();

router.get('/articles', verifyToken, getAuthorOwnArticles);
router.get('/:id/bookmarks', verifyToken, Validation.validateUserId, getAllBookmark);

export default router;
