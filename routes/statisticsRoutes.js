import { Router } from 'express';

import AuthMiddlewware from '../middlewares/Authentication';
import ProfileController from '../controllers/ProfileController';

const { articlesReadCount, articlesUserRead } = ProfileController;
const { verifyToken, verifiedUserOnly } = AuthMiddlewware;
const router = Router();

router.get('/published', verifyToken, verifiedUserOnly, articlesReadCount);
router.get('/read', verifyToken, verifiedUserOnly, articlesUserRead);

export default router;
