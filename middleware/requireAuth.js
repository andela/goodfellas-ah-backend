const jwt = require('jsonwebtoken');
const config = require('../config');

exports.auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Session has expired' });
      } else {
        req.userID = decoded.id;
        next();
      }
    });
  } else {
    return res.status(401).send({ message: 'Unauthorized request, please login' });
  }
};
