const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        res.status(401).send({ message: error.message });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .send({ message: 'Unauthorized request, please login' });
  }
};
