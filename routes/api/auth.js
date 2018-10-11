import userController from '../../controllers/userController';
import { validate } from '../../middleware/validation';

const router = require('express').Router();

router.post('/auth/signup', validate('signup'), userController.signup);
router.post('/auth/signin', validate('signin'), userController.signin);

export default router;
