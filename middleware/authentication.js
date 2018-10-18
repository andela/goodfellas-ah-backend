import { verify } from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const allowVisitors = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token) throw new Error('token not supplied');
    req.userId = verify(token, process.env.SECRET).id;
    next();
  } catch (e) {
    next();
  }
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
    return res
      .status(401)
      .send({ message: 'Unauthorized request, please login' });
  }
};
export { allowVisitors };
