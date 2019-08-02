import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import ratingRoutes from './ratingRoutes';
import articleRoutes from './articleRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/articles', ratingRoutes);
router.use('/articles', articleRoutes);
router.use('/users', userRoutes);

export default router;
