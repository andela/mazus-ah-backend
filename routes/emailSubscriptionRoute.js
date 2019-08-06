import { Router } from 'express';
import EmailSubscription from '../controllers/EmailSubscription';
import AuthMiddleware from '../middlewares/Authentication';

const { emailNotifySubscription } = EmailSubscription;
const { verifyToken, verifiedUserOnly } = AuthMiddleware;
const router = Router();

router.patch('/emailNotify', verifyToken, verifiedUserOnly, emailNotifySubscription);

export default router;
