import { Router } from 'express';
import customSearch from '../controllers/searchController';

const router = Router();

router.get('/', customSearch);

export default router;
