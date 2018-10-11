const router = require('express').Router();

router.use('/', require('./auth'));
router.use('/', require('./user'));
router.use('/', require('./profile'));
router.use('/', require('./articles'));
router.use('/', require('./passwordReset'));

module.exports = router;
