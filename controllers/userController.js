const db = require('../models');
const utility = require('../lib/utility');
const userHelper = require('../lib/user');

const { User, FollowersTable } = db;

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
      .then(newUser => res.status(201).send({
        message: 'Successfully created your account',
        token: utility.createToken(newUser)
      }))
      .catch(() => res.status(500).send({ error: 'Internal server error' }));
  },
  async signin(req, res) {
    const values = utility.trimValues(req.body);
    const { email, password } = values;

    const existingUser = await userHelper.findUser(email);

    if (!existingUser) {
      return res.status(400).send({ message: 'The account with this email does not exist' });
    }

    const match = await utility.comparePasswords(password, existingUser.dataValues.password);

    if (match) {
      res.status(200).send({
        message: 'Successfully signed in',
        token: utility.createToken(existingUser.dataValues.id),
      });
    } else {
      res.status(400).send({ message: 'Incorrect email or password' });
    }
  },
  async follow(req, res) {
    const followerId = req.userId;
    const followedId = req.params.userId;
    try {
      await userHelper.throwErrorOnBadRequest(followerId, followedId);
      console.log(followedId, followerId);
      const followUser = await FollowersTable.create({ followerId, followedId });
      res.status(201).send({
        message: `You're now following ${followUser.dataValues.followedId}`
      });
    } catch (err) {
      res.status(500).send({
        message: err.message
      });
    }
  },
  async unfollow(req, res) {
    const followerId = req.userId;
    const followedId = req.params.userId;
    try {
      const userUnfollow = await FollowersTable.destroy({ where: { followerId, followedId } });
      if (userUnfollow === 0) throw new Error('unExistingFollow');
      res.status(201).send({
        message: `You unfollowed ${followedId}`
      });
    } catch (err) {
      res.status(500).send({
        message: err.message === 'unExistingFollow'
          ? 'You\'re not following this user, no need to unfollow'
          : 'Internal server error'
      });
    }
  },
  async listOfFollowedUsers(req, res) {
    const { userId } = req.params;
    try {
      const followedUsers = await FollowersTable.findAll({
        where: { followerId: userId },
        attributes: { exclude: ['followerId'] }
      });
      res.status(200).send({
        data: followedUsers,
        message: 'Retrieved followed users'
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error'
      });
    }
  },
  async listOfFollowers(req, res) {
    const { userId } = req.params;
    try {
      const followers = await FollowersTable.findAll({
        where: { followedId: userId },
        attributes: { exclude: ['followedId'] }
      });
      res.status(200).send({
        data: followers,
        message: 'Retrieved followers'
      });
    } catch (err) {
      res.status(500).send({
        message: 'Internal server error'
      });
    }
  },
};
