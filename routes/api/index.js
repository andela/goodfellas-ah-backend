const router = require('express').Router();

router.use('/', require('./auth').default);
router.use('/', require('./profile').default);
router.use('/', require('./articles').default);

export default router;
