const router = require('express').Router();
const userController = require('../../controllers/userController');
const { validateForgotPassword, findUserByToken, validateResetPassword } = require('../..//middleware/validation');

// forgot password
router.post(
  '/forgotPassword',
  validateForgotPassword('forgotPassword'),
  userController.forgotPassword
);

// reset password
router.post(
  '/resetPassword',
  validateResetPassword('resetPassword'),
  findUserByToken, userController.resetPassword
);

module.exports = router;
