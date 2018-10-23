import express from 'express';
import authenticate from '../../middleware/authentication';

const router = express.Router();

const userController = require('../../controllers/userController');

router.post('/user/follow/:userId', authenticate, userController.follow);
router.delete('/user/follow/:userId', authenticate, userController.unfollow);
router.get('/user/followed/:userId', authenticate, userController.listOfFollowedUsers);
router.get('/user/followers/:userId', authenticate, userController.listOfFollowers);
router.get('/user/stats/:slug', authenticate, userController.getAReadingStats);
router.get('/user/stats', authenticate, userController.getAllReadingStats);

module.exports = router;
