import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import AuthMiddleware from '../middlewares/Authentication';
import articleValidationSchema from '../middlewares/articleValidation';

const { createArticle } = ArticleController;
const { verifyToken } = AuthMiddleware;
const { articleValidation } = articleValidationSchema;

const router = Router();

router.post('/', verifyToken, articleValidation, createArticle);

export default router;
