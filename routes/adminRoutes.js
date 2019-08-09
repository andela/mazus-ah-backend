import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/Authentication';
import Validate from '../middlewares/inputValidation';

const { signUp } = AuthController;
const { getAllUsers, deleteUser, updateUser } = AdminController;
const { verifyToken, verifySuperAdmin } = AuthMiddleware;

const router = Router();

router.post('/users', verifyToken, verifySuperAdmin, Validate.signup, signUp);
router.get('/users', verifyToken, verifySuperAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, verifySuperAdmin, deleteUser);
router.patch('/users/:id', verifyToken, verifySuperAdmin, updateUser);
export default router;
