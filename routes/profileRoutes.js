import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';
import Validate from '../middlewares/inputValidation';
const { createProfile, editProfile, viewProfile} = ProfileController;

const router = Router();

router.post('/', Validate.createProfileValidate, createProfile)
router.patch('/', Validate.editProfileValidate, editProfile);
router.get('/:id', Validate.validateId, viewProfile)

export default router;
