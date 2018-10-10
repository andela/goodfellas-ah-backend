import { signup, signin } from '../../controllers/userController';
import { validate } from '../../middleware/validation';

const router = require('express').Router();

router.post('/auth/signup', validate('signup'), signup);
router.post('/auth/signin', validate('signin'), signin);

export default router;
