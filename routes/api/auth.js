import passport from 'passport';
import userController from '../../controllers/userController';
import { validate } from '../../middleware/validation';
import googleStrategy from '../../config/passportAuthentication/googleAuthentication';
import facebookStrategy from '../../config/passportAuthentication/facebookAuthentication';
import twitterStrategy from '../../config/passportAuthentication/twitterAuthentication';

const router = require('express').Router();


router.post('/auth/signup', validate('signup'), userController.signup);
router.post('/auth/signin', validate('signin'), userController.signin);
router.get('/auth/facebook', passport.authenticate(facebookStrategy, { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate(facebookStrategy, { session: false }), userController.socialAuth);
router.get('/auth/google', passport.authenticate(googleStrategy, { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate(googleStrategy, { session: false }), userController.socialAuth);
router.get('/auth/twitter', passport.authenticate(twitterStrategy, { scope: ['include_email=true', 'include_entities=false'] }));
router.get('/auth/twitter/callback', passport.authenticate(twitterStrategy, { session: false }), userController.socialAuth);

export default router;
