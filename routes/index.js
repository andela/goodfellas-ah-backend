const router = require('express').Router();

router.use('/api', require('./api').default);

router.all('*', (req, res) => {
  res.status(404).json({
    message: 'Invalid request, Route does not exist',
  });
});

export default router;
