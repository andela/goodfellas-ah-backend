import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import helper from './helper';
import db from '../models';

const { User } = db;

const secret = process.env.SECRET;
export default (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    helper.findRecord(User, { email: process.env.email })
      .then((user) => {
        if (user) {
          return res.status(400).send({ error: 'Another user with this email already exists' });
        }
      })
      .catch(error => res.status(500).send({ error: error.message }));
    User
      .create({
        email: process.env.email,
        firstname: process.env.firstname,
        lastname: process.env.lastname,
        password: hash,
        role: process.env.role,
      })
      .then((admin) => {
        const payload = {
          userId: admin.id,
          firstname: admin.firstname,
          lastname: admin.lastname,
          role: admin.role,
        };
        const token = jwt.sign(payload, secret, {
          expiresIn: '10h',
        });
        return res.status(200).send({ message: 'Admin created!', token });
      })
      .catch(error => res.status(500).send({ error: error.message }));
  });
};
