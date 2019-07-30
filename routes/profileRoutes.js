import { Router } from 'express';

import AuthMiddlewware from '../middlewares/Authentication';
import ProfileController from '../controllers/ProfileController';
import Validate from '../middlewares/inputValidation';

const { createProfile, editProfile, viewProfile } = ProfileController;

const { verifyToken } = AuthMiddlewware;
const router = Router();

router.post('/', verifyToken, Validate.createProfileValidate, createProfile);
router.patch('/:id', verifyToken, Validate.editProfileValidate, editProfile);
router.get('/:id', verifyToken, Validate.validateId, viewProfile);


export default router;
