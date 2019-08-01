import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import AuthMiddleware from '../middlewares/Authentication';
import articleValidationSchema from '../middlewares/articleValidation';

const {
  createArticle, getArticlesArticleBySlug, getAllArticles, getArticlesByAuthor,
  editArticle, deleteArticle
} = ArticleController;
const { verifyToken, verifiedUserOnly } = AuthMiddleware;
const { articleValidation, validateId } = articleValidationSchema;

const router = Router();

router.post('/', verifyToken, verifiedUserOnly, articleValidation, createArticle);
router.get('/:id/:slug', validateId, getArticlesArticleBySlug);
router.get('/:id', validateId, getArticlesByAuthor);
router.get('/', getAllArticles);
router.patch('/:slug', verifyToken, verifiedUserOnly, articleValidation, editArticle);
router.delete('/:slug', verifyToken, verifiedUserOnly, deleteArticle);

export default router;
