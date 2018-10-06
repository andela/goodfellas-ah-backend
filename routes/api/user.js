import express from 'express';
import authenticate from '../../middleware/authentication';

const router = express.Router();

const userController = require('../../controllers/userController');

router.post('/user/follow', authenticate, userController.follow);

module.exports = router;
