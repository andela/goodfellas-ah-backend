import userController from '../../controllers/userController';

const router = require('express').Router();

const { validateForgotPassword, findUserByToken, validateResetPassword } = require('../../middleware/validation');


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

module.exports = router;
