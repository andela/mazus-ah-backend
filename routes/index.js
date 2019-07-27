import { Router } from 'express';
import authRoutes from './authRoutes';
import ProfileRoute from './profileRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', ProfileRoute);

export default router;
