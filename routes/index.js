import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import ratingRoutes from './ratingRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/articles', ratingRoutes);

export default router;
