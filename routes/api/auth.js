const router = require('express').Router();
const passport = require('passport');

const userController = require('../../controllers/userController');
const { validate } = require('../..//middleware/validation');
const googleToken = require('../../config/passport');

router.post('/auth/signup', validate('signup'), userController.signup);
router.post('/auth/signin', validate('signin'), userController.signin);
router.post('/auth/googlesignup', passport.authenticate('google-plus-token', { session: false }), userController.socialLogin);

module.exports = router;
