import express from 'express';
import authenticate from '../../middleware/authentication';
import validator from '../../middleware/validator';
import { testRules } from '../../lib/utility';

const router = express.Router();
const userController = require('../../controllers/userController');

router.post('/user/follow', authenticate, userController.follow);
router.post('/user/unfollow', authenticate, userController.unfollow);
router.get('/user/followed', authenticate, userController.followed);
router.get('/user/followers', authenticate, userController.followers);
router.post('/test/validator', validator(testRules), (req, res) => res.send({
  message: 'You got here, you are so cool.',
  data: req.body
}));

module.exports = router;
