import express from 'express';
import authenticate from '../../middleware/authentication';
import userController from '../../controllers/userController';
import { acceptableValues } from '../../middleware/validation';
import { notificationRule } from '../../lib/utility';

const router = express.Router();

router.post('/user/follow/:userId', authenticate, userController.follow);
router.delete('/user/follow/:userId', authenticate, userController.unfollow);
router.get('/user/followed/:userId', authenticate, userController.listOfFollowedUsers);
router.get('/user/followers/:userId', authenticate, userController.listOfFollowers);
router.post('/user/notification/on/:setting', authenticate, acceptableValues(notificationRule), userController.setNotification);
router.post('/user/notification/off/:setting', authenticate, acceptableValues(notificationRule), userController.unsetNotification);
router.get('/user/notification/', authenticate, userController.getNotifications);

module.exports = router;
