const router = require('express').Router();

router.use('/', require('./auth'));
router.use('/', require('./profile'));
router.use('/', require('./articles'));

module.exports = router;
