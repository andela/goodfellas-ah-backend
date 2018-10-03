const requireAuth = require('../../middleware/requireAuth');

const router = require('express').Router();

router.get('/articles', requireAuth.auth, function(req, res) {
	res.send({ message: 'All Articles Retrieved Successfully' });
});

module.exports = router;