import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import CommentController from '../controllers/CommentController';
import AuthMiddleware from '../middlewares/Authentication';
import articleValidationSchema from '../middlewares/articleValidation';
import LikesController from '../controllers/LikesController';
import commentValidate from '../middlewares/commentValidations';
import Validate from '../middlewares/inputValidation';
import Trending from '../controllers/TrendingArticlesController';
import TagsController from '../controllers/TagsController';

const { trend } = Trending;
const {
  createArticle,
  getSingleArticleBySlug,
  getAllArticles,
  getArticlesByAuthor,
  editArticle,
  deleteArticle,
  bookmarkArticle,
  shareArticle,
  reportArticle,
  getCurrentArticleStat,
} = ArticleController;

const { postComment } = CommentController;
const { getTags } = TagsController;
const { likeArticle, dislikeArticle } = LikesController;
const { articleValidation, validateId, validateGetCurrentArticlState } = articleValidationSchema;
const { validateEmail } = Validate;
const { validateReport } = commentValidate;
const {
  verifyToken,
  verifiedUserOnly,
  fetchRequester,
} = AuthMiddleware;


const router = Router();

router.post('/:id/bookmark', verifyToken, Validate.validateParamsId, verifiedUserOnly, bookmarkArticle);
router.post('/getcurrentarticlestat', validateGetCurrentArticlState, getCurrentArticleStat);
router.get('/trends', trend);
router.get('/tags', getTags);
router.post('/', verifyToken, verifiedUserOnly, articleValidation, createArticle);
router.get('/:slug', fetchRequester, getSingleArticleBySlug);
router.get('/:slug', getSingleArticleBySlug);
router.get('/author/:id', validateId, getArticlesByAuthor);
router.get('/', getAllArticles);
router.patch('/:slug', verifyToken, verifiedUserOnly, articleValidation, editArticle);
router.delete('/:slug', verifyToken, verifiedUserOnly, deleteArticle);

router.post('/:slug/comments', verifyToken, verifiedUserOnly, commentValidate.comment, postComment);
router.post('/:slug/like', verifyToken, verifiedUserOnly, likeArticle);
router.post('/:slug/dislike', verifyToken, verifiedUserOnly, dislikeArticle);
router.get('/:slug/share/mail', verifyToken, validateEmail, verifiedUserOnly, shareArticle);
router.get('/:slug/share/twitter', verifyToken, verifiedUserOnly, shareArticle);
router.get('/:slug/share/facebook', verifyToken, verifiedUserOnly, shareArticle);
router.post('/:slug/report', verifyToken, verifiedUserOnly, validateReport, reportArticle);

export default router;
