const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, config.secret, (error, decoded) => {
      if (error) {
        res.status(401).send({ message: error.message });
      } else {
        req.userID = decoded.id;
        next();
      }
    });
  } else {
    return res.status(401).send({ message: 'Unauthorized request, please login' });
  }
};
