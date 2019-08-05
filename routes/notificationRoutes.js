import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import AuthMiddleware from '../middlewares/Authentication';

const { getNotifications, readNotification } = NotificationController;
const { verifyToken } = AuthMiddleware;
const router = Router();

router.get('/', verifyToken, getNotifications);
router.patch('/:id', verifyToken, readNotification);

export default router;
