import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import ratingRoutes from './ratingRoutes';
import articleRoutes from './articleRoutes';
import userRoutes from './userRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/articles', ratingRoutes);
router.use('/articles', articleRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);

export default router;
