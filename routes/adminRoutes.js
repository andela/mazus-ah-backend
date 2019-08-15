import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import CommentController from '../controllers/CommentController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';
import ArticleController from '../controllers/ArticleController';

const {
  getAllUsers,
  deleteUser,
  updateUser,
  banUser,
  unbanUser,
  deleteArticle,
  deleteComment,
  signUpAdmin
} = AdminController;
const { verifyToken, verifySuperAdmin, verifyAdmins } = AuthMiddleware;
const { getReportedArticles } = ArticleController;
const { getEditCommentHistory } = CommentController;
const router = Router();

router.post('/createuser', verifyToken, verifySuperAdmin, Validate.signup, signUpAdmin);
router.get('/users', verifyToken, verifySuperAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, verifySuperAdmin, deleteUser);
router.patch('/users/:id', verifyToken, verifySuperAdmin, updateUser);
router.get('/reportedarticles', verifyToken, verifyAdmins, getReportedArticles);
router.patch('/ban/:id', verifyToken, verifyAdmins, banUser);
router.patch('/unban/:id', verifyToken, verifyAdmins, unbanUser);
router.delete('/articles/:slug', verifyToken, verifyAdmins, deleteArticle);
router.delete('/comments/:commentId', verifyToken, verifyAdmins, deleteComment);

router.get('/comments/:commentId', verifyToken, verifyAdmins, getEditCommentHistory);
export default router;
