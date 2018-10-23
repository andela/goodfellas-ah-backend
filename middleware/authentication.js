import { verify } from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const tokenIsValid = (token) => {
  try {
    return verify(token, process.env.SECRET);
  } catch (error) {
    return false;
  }
};
const allowVisitors = (req, res, next) => {
  const token = req.headers.authorization;
  const validToken = tokenIsValid(token);
  if (validToken) {
    req.userId = validToken.id;
    return next();
  }
  return next();
};
export default (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        res.status(401).send({ message: error.message });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } else {
    return res.status(401).send({ message: 'Unauthorized request, please login' });
  }
};
export { tokenIsValid, allowVisitors };
