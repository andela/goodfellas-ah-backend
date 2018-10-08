const db = require('../models');
const utility = require('../lib/utility');
const userHelper = require('../lib/user');
const profileController = require('../controllers/profileController');

const { User } = db;

module.exports = {
  async signup(req, res) {
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
  }
};
