const router = require('express').Router();
const multiparty = require('connect-multiparty');

const profileController = require('../../controllers/profileController');
const authenticate = require('../../middleware/authentication');

const multipart = multiparty();
const cloudinary = require('../../middleware/cloudinary');
const validate = require('../../middleware/profileValidation');

router.put(
  '/profile/user',
  authenticate,
  multipart,
  validate.undefinedFields,
  validate.emptyField,
  validate.extraFields,
  cloudinary.imageUpload,
  profileController.updateProfile
);

router.get('/profile/user/:userId', profileController.getProfile);

module.exports = router;
