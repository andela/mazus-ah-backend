import { Router } from 'express';

import AuthMiddlewware from '../middlewares/Authentication';
import ProfileController from '../controllers/ProfileController';
import Validate from '../middlewares/inputValidation';
import Followership from '../controllers/followershipController';

const {
  createProfile,
  editProfile,
  viewProfile,
  articlesUserRead,
  articlesReadCount,
} = ProfileController;

const {
  validateId,
  editProfileValidate,
  createProfileValidate,
  validateParamsId,
} = Validate;
const {
  follow,
  unfollow,
  getUserFollowers,
  getUserFollowings,
} = Followership;

const { verifyToken, verifiedUserOnly } = AuthMiddlewware;
const router = Router();

router.post('/', verifyToken, createProfileValidate, createProfile);
router.patch('/:id', verifyToken, editProfileValidate, editProfile);
router.get('/articlereadcount', verifyToken, verifiedUserOnly, articlesReadCount);
router.get('/myreadcount', verifyToken, verifiedUserOnly, articlesUserRead);
router.get('/:id', verifyToken, validateId, viewProfile);
router.post('/follow/:id', verifyToken, validateParamsId, follow);
router.delete('/follow/:id', verifyToken, validateParamsId, unfollow);
router.get('/followers/:id', verifyToken, validateParamsId, getUserFollowers);
router.get('/followings/:id', verifyToken, validateParamsId, getUserFollowings);

export default router;
