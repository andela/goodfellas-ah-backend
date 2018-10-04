const router = require('express').Router();

const authenticate = require('../../middleware/authentication');

router.get('/articles', authenticate, (req, res) => {
  res.send({ message: 'All Articles Retrieved Successfully' });
});

module.exports = router;
