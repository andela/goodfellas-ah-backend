const router = require('express').Router();

const requireAuth = require('../../middleware/requireAuth');

router.get('/articles', requireAuth.auth, (req, res) => {
  res.send({ message: 'All Articles Retrieved Successfully' });
});

module.exports = router;
