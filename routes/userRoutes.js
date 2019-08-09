import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import UserController from '../controllers/UsersController';
import AuthMiddleware from '../middlewares/Authentication';
import Validation from '../middlewares/inputValidation';

const {
  getAuthorOwnArticles,
  getAllBookmark
} = ArticleController;
const { verifyToken, verifiedUserOnly } = AuthMiddleware;
const { getAllUsers } = UserController;

const router = Router();

router.get('/', verifyToken, verifiedUserOnly, getAllUsers);
router.get('/articles', verifyToken, getAuthorOwnArticles);
router.get('/:id/bookmarks', verifyToken, Validation.validateUserId, getAllBookmark);

export default router;
