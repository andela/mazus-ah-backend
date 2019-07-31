import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import AuthMiddleware from '../middlewares/Authentication';
import articleValidationSchema from '../middlewares/articleValidation';

const {
  createArticle, getArticlesArticleBySlug, getAllArticles, getArticlesByAuthor
} = ArticleController;
const { verifyToken, verifiedUserOnly } = AuthMiddleware;
const { articleValidation } = articleValidationSchema;

const router = Router();

router.post('/', verifyToken, verifiedUserOnly, articleValidation, createArticle);
router.get('/:email/:slug', getArticlesArticleBySlug);
router.get('/:email', getArticlesByAuthor);
router.get('/', getAllArticles);

export default router;
