import express from 'express';
import authenticate from '../../middleware/authentication';

const router = express.Router();

const userController = require('../../controllers/userController');

router.post('/user/follow', authenticate, userController.follow);
router.post('/user/unfollow', authenticate, userController.unfollow);
router.get('/user/followed', authenticate, userController.followed);
router.get('/user/followers', authenticate, userController.followers);

module.exports = router;
