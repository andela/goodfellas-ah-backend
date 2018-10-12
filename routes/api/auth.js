const router = require('express').Router();
const passport = require('passport');

const userController = require('../../controllers/userController');
const { validate } = require('../..//middleware/validation');
const googleStrategy = require('../../config/passportAuthentication/googleAuthentication');
const facebookStrategy = require('../../config/passportAuthentication/facebookAuthentication');
const twitterStrategy = require('../../config/passportAuthentication/twitterAuthentication');


router.post('/auth/signup', validate('signup'), userController.signup);
router.post('/auth/signin', validate('signin'), userController.signin);
router.get('/auth/facebook', passport.authenticate(facebookStrategy, { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate(facebookStrategy, { session: false }), userController.socialAuth);
router.get('/auth/google', passport.authenticate(googleStrategy, { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate(googleStrategy, { session: false }), userController.socialAuth);
router.get('/auth/twitter', passport.authenticate(twitterStrategy, { scope: ['include_email=true', 'include_entities=false'] }));
router.get('/auth/twitter/callback', passport.authenticate(twitterStrategy, { session: false }), userController.socialAuth);

module.exports = router;
