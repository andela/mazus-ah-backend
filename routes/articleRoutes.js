import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import CommentController from '../controllers/CommentController';
import AuthMiddleware from '../middlewares/Authentication';
import articleValidationSchema from '../middlewares/articleValidation';
import LikesController from '../controllers/LikesController';
import commentValidate from '../middlewares/commentValidations';
import Validate from '../middlewares/inputValidation';
import Trending from '../controllers/TrendingArticlesController';

const { trend } = Trending;
const {
  createArticle,
  getSingleArticleBySlug,
  getAllArticles,
  getArticlesByAuthor,
  editArticle,
  deleteArticle,
  bookmarkArticle,
} = ArticleController;
const { postComment } = CommentController;
const { verifyToken, verifiedUserOnly, fetchRequester } = AuthMiddleware;
const { likeArticle, dislikeArticle } = LikesController;
const { articleValidation, validateId } = articleValidationSchema;

const router = Router();

router.post('/:id/bookmark', verifyToken, Validate.validateParamsId, verifiedUserOnly, bookmarkArticle);

router.get('/trends', trend);
router.post('/', verifyToken, verifiedUserOnly, articleValidation, createArticle);
router.get('/:slug', fetchRequester, getSingleArticleBySlug);
router.get('/author/:id', validateId, getArticlesByAuthor);
router.get('/', getAllArticles);
router.patch('/:slug', verifyToken, verifiedUserOnly, articleValidation, editArticle);
router.delete('/:slug', verifyToken, verifiedUserOnly, deleteArticle);

router.post('/:slug/comments', verifyToken, verifiedUserOnly, commentValidate.comment, postComment);
router.post('/:slug/like', verifyToken, verifiedUserOnly, likeArticle);
router.post('/:slug/dislike', verifyToken, verifiedUserOnly, dislikeArticle);


export default router;
