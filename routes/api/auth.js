const authController = require('../../controllers/authController');
const validate = require('../..//middleware/validate');

const router = require('express').Router();

router.post('/auth/signup', validate.signupPost, authController.signup);

module.exports = router;