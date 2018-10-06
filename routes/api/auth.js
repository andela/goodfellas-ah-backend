const router = require('express').Router();
const passport = require('passport');

const userController = require('../../controllers/userController');
const { validate } = require('../..//middleware/validation');
const strategy = require('../../config/passport');

router.post('/auth/signup', validate('signup'), userController.signup);
router.post('/auth/signin', validate('signin'), userController.signin);
router.post('/auth/google', passport.authenticate(strategy, { session: false }), userController.socialLogin);

module.exports = router;
