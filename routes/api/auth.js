const router = require('express').Router();

const userController = require('../../controllers/userController');
const { validate } = require('../..//middleware/validation');

router.post('/auth/signup', validate('signup'), userController.signup);
router.post('/auth/signin', validate('signin'), userController.signin);

module.exports = router;
