import passwordResetRouter from './passwordReset';

const router = require('express').Router();

router.use('/', require('./auth'));
router.use('/', require('./articles'));

router.use('/', passwordResetRouter);

module.exports = router;
