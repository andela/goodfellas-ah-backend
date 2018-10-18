import multiparty from 'connect-multiparty';

import profileController from '../../controllers/profileController';
import authenticate, { allowVisitors } from '../../middleware/authentication';
import validate from '../../middleware/validation';

const router = require('express').Router();

const multipart = multiparty();

router.put(
  '/user/profile/:userId',
  authenticate,
  multipart,
  validate.profileValidation,
  profileController.updateProfile
);

router.get('/user/profile/:userId', allowVisitors, profileController.getProfile);
router.get('/user/profiles', authenticate, profileController.getProfiles);

export default router;
