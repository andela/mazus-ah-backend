import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import UserController from '../controllers/UsersController';
import AuthMiddleware from '../middlewares/Authentication';

const {
  getAuthorOwnArticles
} = ArticleController;
const { verifyToken, verifiedUserOnly } = AuthMiddleware;
const { getAllUsers } = UserController;

const router = Router();

router.get('/', verifyToken, verifiedUserOnly, getAllUsers);
router.get('/articles', verifyToken, getAuthorOwnArticles);

export default router;
