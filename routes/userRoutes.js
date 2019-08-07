import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import AuthMiddleware from '../middlewares/Authentication';

const {
  getAuthorOwnArticles,
  getAllBookmark
} = ArticleController;
const { verifyToken } = AuthMiddleware;

const router = Router();

router.get('/articles', verifyToken, getAuthorOwnArticles);
router.get('/bookmarks', verifyToken, getAllBookmark);

export default router;
