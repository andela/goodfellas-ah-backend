import express from 'express';
import userController from '../../controllers/userController';
import { validateForgotPassword, findUserByToken, validateResetPassword } from '../../middleware/validation';

const router = express.Router();

// forgot password
router.post(
  '/forgotPassword',
  validateForgotPassword,
  userController.forgotPassword
);

// reset password
router.post(
  '/resetPassword',
  validateResetPassword,
  findUserByToken, userController.resetPassword
);

export default router;
