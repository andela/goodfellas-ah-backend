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
router.get('/user/stats', authenticate, userController.getAllStats);
router.get('/user/stats/:slug', authenticate, userController.getReadingStats);
router.put('/user/notification/on/:setting', authenticate, acceptableValues(notificationRule), userController.setNotification);
router.put('/user/notification/off/:setting', authenticate, acceptableValues(notificationRule), userController.unsetNotification);
router.get('/user/notification/', authenticate, userController.getNotifications);
router.get('/user/notification/:notificationId', authenticate, userController.getNotification);
router.put('/user/notification/seen/:notificationId', authenticate, userController.seenNotification);

module.exports = router;
