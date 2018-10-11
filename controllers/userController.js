const jwt = require('jsonwebtoken');
const db = require('../models');
const utility = require('../lib/utility');
const userHelper = require('../lib/user');
require('dotenv').config();
const profileController = require('../controllers/profileController');

const { User } = db;

module.exports = {
  async signup(req, res) {
    try {
      const values = utility.trimValues(req.body);
      const {
        firstname, lastname, email, password
      } = values;

      const existingUser = await userHelper.findUser(email);

      if (existingUser) {
        return res.status(409).send({ message: 'Email is in use' });
      }

      const encryptedPassword = await utility.encryptPassword(password);

      User.create({
        firstname,
        lastname,
        email,
        password: encryptedPassword
      })
        .then((newUser) => {
          profileController.createProfile(newUser);
          return res.status(201).json({
            error: false,
            token: utility.createToken(newUser),
            userId: newUser.id,
            message: 'User created Successfully'
          });
        })
        .catch(() => res.status(500).send({ error: 'Internal server error' }));
    } catch (err) {
      res.status(500).send({ error: 'Internal server error' });
    }
  },
  async signin(req, res) {
    const values = utility.trimValues(req.body);
    const { email, password } = values;

    const existingUser = await userHelper.findUser(email);

    if (!existingUser) {
      return res
        .status(400)
        .send({ message: 'The account with this email does not exist' });
    }

    const match = await utility.comparePasswords(
      password,
      existingUser.dataValues.password
    );

    if (match) {
      res.status(200).send({
        message: 'Successfully signed in',
        token: utility.createToken(existingUser.dataValues)
      });
    } else {
      res.status(400).send({ message: 'Incorrect email or password' });
    }
  },
  async socialAuth(req, res) {
    // Check if user exists

    const existingUser = await userHelper.findUser(req.user.email);

    if (existingUser) {
      // If Yes, check if it was with the same social account
      const { password } = req.user;

      const match = await utility.comparePasswords(password, existingUser.dataValues.password);
      // If yes then authenticate user
      if (match) {
        res
          .status(200)
          .send({
            message: 'Successfully signed in',
            token: utility.createToken(existingUser.dataValues)
          });
      } else {
        // If no, return error message
        res.status(400).send({ message: 'You can\'t login through this platform' });
      }
    } else {
      // If No, create user then authenticate user
      const encryptedPassword = await utility.encryptPassword(req.user.password);
      User.create({
        firstname: req.user.firstName,
        lastname: req.user.lastName,
        email: req.user.email,
        password: encryptedPassword,
        account_type: req.user.account_type
      })
        .then((newUser) => {
          profileController.createProfile(newUser);
          return res.status(201).json({
            error: false,
            token: utility.createToken(newUser),
            userId: newUser.id,
            message: 'User created Successfully'
          });
        })
        .catch(() => res.status(500).send({ error: 'Internal server error' }));
    }
  },

  async forgotPassword(req, res) {
    const user = await userHelper.findUser(req.email);
    if (!user) {
      return res.status(404).send({
        message: 'The account with this email does not exist'
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 60 * 60 });
    const expiration = new Date(Date.now() + (60 * 60 * 1000));
    const mailMessage = `Click <a href="http://127.0.0.1:3000/api/resetPassword?token=
    ${token}">here</a> to reset your password`;
    user.update({ password_reset_token: token, password_reset_time: expiration })
      .then(async () => {
        const message = { message: 'An email has been sent to your account', token };
        const sentMail = utility.sendEmail(req.email, mailMessage);
        if (sentMail) {
          return res.status(200).send(message);
        }
      });
  },

  async resetPassword(req, res) {
    const encryptedPassword = await utility.encryptPassword(req.body.password.trim());
    return req.user.update({
      password: encryptedPassword,
      password_reset_time: null,
      password_reset_token: null
    }).then(async (user) => {
      const mailMessage = 'Your password has been reset successfully';
      const message = { message: 'Password reset successful' };
      const sentMail = await utility.sendEmail(user.email, mailMessage);
      if (sentMail) {
        return res.status(200).send(message);
      }
    });
  },
};
