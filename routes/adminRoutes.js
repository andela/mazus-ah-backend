import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import AuthController from '../controllers/AuthController';
import CommentController from '../controllers/CommentController';
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
} = AdminController;
const { verifyToken, verifySuperAdmin, verifyAdmins } = AuthMiddleware;
const { getReportedArticles } = ArticleController;
const { getEditCommentHistory } = CommentController;
const router = Router();

router.post('/users', verifyToken, verifySuperAdmin, Validate.signup, signUp);
router.get('/users', verifyToken, verifySuperAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, verifySuperAdmin, deleteUser);
router.patch('/users/:id', verifyToken, verifySuperAdmin, updateUser);
router.get('/reportedarticles', verifyToken, verifyAdmins, getReportedArticles);
router.patch('/ban/:id', verifyToken, verifyAdmins, banUser);
router.patch('/unban/:id', verifyToken, verifyAdmins, unbanUser);

router.get('/comments/:commentId', verifyToken, verifyAdmins, getEditCommentHistory);
export default router;
