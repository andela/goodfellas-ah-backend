const router = require('express').Router();
const passport = require('passport');

const userController = require('../../controllers/userController');
const { validate } = require('../..//middleware/validation');
const googleStrategy = require('../../config/passportAuthentication/googleAuthentication');
const facebookStrategy = require('../../config/passportAuthentication/facebookAuthentication');
const twitterStrategy = require('../../config/passportAuthentication/twitterAuthentication');


router.post('/auth/signup', validate('signup'), userController.signup);
router.post('/auth/signin', validate('signin'), userController.signin);
router.post('/auth/google', passport.authenticate(googleStrategy, { session: false }), userController.socialAuth);
router.post('/auth/facebook', passport.authenticate(facebookStrategy, { session: false }), userController.socialAuth);
router.post('/auth/twitter', passport.authenticate(twitterStrategy, { session: false }), userController.socialAuth);

module.exports = router;
