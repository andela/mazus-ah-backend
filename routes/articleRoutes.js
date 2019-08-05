import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import CommentController from '../controllers/CommentController';
import AuthMiddleware from '../middlewares/Authentication';
import articleValidationSchema from '../middlewares/articleValidation';
import validate from '../middlewares/commentValidations';
import LikesController from '../controllers/LikesController';

const {
  createArticle, getArticlesArticleBySlug, getAllArticles, getArticlesByAuthor,
  editArticle, deleteArticle
} = ArticleController;
const { postComment } = CommentController;
const { likeArticle, dislikeArticle } = LikesController;
const { verifyToken, verifiedUserOnly } = AuthMiddleware;
const { articleValidation, validateId } = articleValidationSchema;

const router = Router();

router.post('/', verifyToken, verifiedUserOnly, articleValidation, createArticle);
router.get('/:id/:slug', validateId, getArticlesArticleBySlug);
router.get('/:id', validateId, getArticlesByAuthor);
router.get('/', getAllArticles);
router.patch('/:slug', verifyToken, verifiedUserOnly, articleValidation, editArticle);
router.delete('/:slug', verifyToken, verifiedUserOnly, deleteArticle);

router.post('/:slug/comments', verifyToken, verifiedUserOnly, validate.comment, postComment);
router.post('/:slug/like', verifyToken, verifiedUserOnly, likeArticle);
router.post('/:slug/dislike', verifyToken, verifiedUserOnly, dislikeArticle);

export default router;
