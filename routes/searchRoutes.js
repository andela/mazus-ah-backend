import { Router } from 'express';
import SearchController from '../controllers/searchController';

const router = Router();

const { customSearch } = SearchController;

router.get('/', customSearch);

export default router;
