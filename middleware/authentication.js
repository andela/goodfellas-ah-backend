import jwt from 'jsonwebtoken';
import config from '../config';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('Unauthorized request, please login');
    req.userId = jwt.verify(token, config.secret).id;
    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};
