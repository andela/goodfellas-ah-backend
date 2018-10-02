const authController = require('../../controllers/authController');

const router = require('express').Router();

router.post('/auth/signup', authController.signup);

module.exports = router;