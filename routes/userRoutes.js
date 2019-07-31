import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import AuthMiddleware from '../middlewares/Authentication';

const {
  getAuthorOwnArticles
} = ArticleController;
const { verifyToken } = AuthMiddleware;

const router = Router();

router.get('/articles', verifyToken, getAuthorOwnArticles);

export default router;
