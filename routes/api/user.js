import express from 'express';
import authenticate, { allowVisitors } from '../../middleware/authentication';
import userController from '../../controllers/userController';
import { acceptableValues } from '../../middleware/validation';
import utility from '../../lib/utility';

const router = express.Router();

router.post('/user/follow/:userId', authenticate, userController.follow);
router.delete('/user/follow/:userId', authenticate, userController.unfollow);
router.get('/user/followed/:userId', allowVisitors, userController.listOfFollowedUsers);
router.get('/user/followers/:userId', allowVisitors, userController.listOfFollowers);
router.put('/user/notification/on/:setting', authenticate, acceptableValues(utility.notificationRule), userController.setNotification);
router.put('/user/notification/off/:setting', authenticate, acceptableValues(utility.notificationRule), userController.unsetNotification);
router.get('/user/notification/', authenticate, userController.getNotifications);
router.get('/user/notification/:notificationId', authenticate, userController.getNotification);
router.put('/user/notification/seen/:notificationId', authenticate, userController.seenNotification);

module.exports = router;
