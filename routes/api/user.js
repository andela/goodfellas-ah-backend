const router = require('express').Router();

const userController = require('../../controllers/userController');

router.post('/user/follow', userController.follow);

module.exports = router;
