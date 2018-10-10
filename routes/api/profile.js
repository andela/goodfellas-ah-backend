const router = require('express').Router();
const multiparty = require('connect-multiparty');

const profileController = require('../../controllers/profileController');
const authenticate = require('../../middleware/authentication');

const multipart = multiparty();

router.put(
  '/user/profile',
  authenticate,
  multipart,
  profileController.updateProfile
);

router.get('/user/profile/:userId', profileController.getProfile);

module.exports = router;
