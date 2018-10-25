const router = require('express').Router();

router.use('/api', require('./api').default);

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to the Authors Haven API'
  });
});

router.all('*', (req, res) => {
  res.status(404).json({
    message: 'Invalid request, Route does not exist',
  });
});

export default router;
