import express from 'express';
import authenticate from '../../middleware/authentication';
import userController from '../../controllers/userController';

const router = express.Router();

router.post('/user/follow/:userId', authenticate, userController.follow);
router.delete('/user/follow/:userId', authenticate, userController.unfollow);
router.get('/user/followed/:userId', authenticate, userController.listOfFollowedUsers);
router.get('/user/followers/:userId', authenticate, userController.listOfFollowers);
router.post('/user/notification/:setting', authenticate, userController.setNotification);

module.exports = router;
