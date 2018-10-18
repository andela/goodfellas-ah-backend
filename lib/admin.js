import { encryptPassword, createToken } from './utility';
import helper from './helper';
import db from '../models';

const { User } = db;


export default async (req, res) => {
  try {
    const {
      email, firstname, lastname, role
    } = process.env;
    helper.findRecord(User, { email: process.env.email })
      .then((user) => {
        if (user) {
          return res.status(400).send({ error: 'Another user with this email already exists' });
        }
      })
      .catch(error => res.status(500).send({ error: error.message }));
    const password = await encryptPassword(req.body.password);
    User
      .create({
        email,
        firstname,
        lastname,
        password,
        role,
      })
      .then(admin => res.status(201).json({
        error: false,
        token: createToken(admin),
        userId: admin.id,
        message: 'Admin Created!'
      }));
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
