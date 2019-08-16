import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';
import ArticleController from '../controllers/ArticleController';

const { signUp } = AuthController;
const {
  getAllUsers,
  deleteUser,
  updateUser,
  banUser,
  unbanUser,
  deleteArticle,
  deleteComment
} = AdminController;
const { verifyToken, verifySuperAdmin, verifyAdmins } = AuthMiddleware;
const { getReportedArticles } = ArticleController;

const router = Router();

router.post('/users', verifyToken, verifySuperAdmin, Validate.signup, signUp);
router.get('/users', verifyToken, verifySuperAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, verifySuperAdmin, deleteUser);
router.patch('/users/:id', verifyToken, verifySuperAdmin, updateUser);
router.get('/reportedarticles', verifyToken, verifyAdmins, getReportedArticles);
router.patch('/ban/:id', verifyToken, verifyAdmins, banUser);
router.patch('/unban/:id', verifyToken, verifyAdmins, unbanUser);
router.delete('/articles/:slug', verifyToken, verifyAdmins, deleteArticle);
router.delete('/comments/:commentId', verifyToken, verifyAdmins, deleteComment);

export default router;
