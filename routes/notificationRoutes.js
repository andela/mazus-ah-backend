import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import AuthMiddleware from '../middlewares/Authentication';

const { getNotifications, readNotification } = NotificationController;
const { verifyToken, verifiedUserOnly } = AuthMiddleware;
const router = Router();

router.get('/', verifyToken, verifiedUserOnly, getNotifications);
router.patch('/:id', verifyToken, verifiedUserOnly, readNotification);

export default router;
