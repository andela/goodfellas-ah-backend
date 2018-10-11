const router = require('express').Router();
const multiparty = require('connect-multiparty');

const profileController = require('../../controllers/profileController');
const authenticate = require('../../middleware/authentication');
const validate = require('../../middleware/validation');

const multipart = multiparty();

router.put(
  '/user/profile',
  authenticate,
  multipart,
  validate.profileValidation,
  profileController.updateProfile
);

router.get('/user/profile/:userId', profileController.getProfile);
router.get('/user/profiles', authenticate, profileController.getProfiles);

module.exports = router;
