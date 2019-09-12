import { Router } from 'express';

import AuthMiddlewware from '../middlewares/Authentication';
import ProfileController from '../controllers/ProfileController';
import Validate from '../middlewares/inputValidation';
import Followership from '../controllers/followershipController';

const { editProfile, viewProfile } = ProfileController;
const {
  validateId,
  editProfileValidate,
  validateParamsId,
} = Validate;
const {
  follow,
  unfollow,
  getUserFollowers,
  getUserFollowings,
} = Followership;

const { verifyToken } = AuthMiddlewware;
const router = Router();

router.patch('/:id', verifyToken, editProfileValidate, editProfile);
router.get('/:id', validateId, viewProfile);
router.post('/follow/:id', verifyToken, validateParamsId, follow);
router.delete('/follow/:id', verifyToken, validateParamsId, unfollow);
router.get('/followers/:id', validateParamsId, getUserFollowers);
router.get('/followings/:id', validateParamsId, getUserFollowings);

export default router;
