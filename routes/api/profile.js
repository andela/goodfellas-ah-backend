import multiparty from 'connect-multiparty';

import { updateProfile, getProfile } from '../../controllers/profileController';
import authenticate from '../../middleware/authentication';

const router = require('express').Router();

const multipart = multiparty();

router.put(
  '/user/profile',
  authenticate,
  multipart,
  updateProfile
);

router.get('/user/profile/:userId', getProfile);

export default router;
