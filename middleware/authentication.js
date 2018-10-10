import { verify } from 'jsonwebtoken';

require('dotenv').config();

export default (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        res.status(401).send({ message: error.message });
      } else {
        req.userID = decoded.id;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .send({ message: 'Unauthorized request, please login' });
  }
};
