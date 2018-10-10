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
    const followedUserId = req.params.userId;
    try {
      const user = await userHelper.throwErrorOnNonExistingUser(followedUserId);
      await userHelper.throwErrorOnBadRequest(followerId, followedUserId);
      await FollowersTable.create({ followerId, followedUserId });
      res.status(201).send({
        message: `You're now following ${user.dataValues.firstname} ${user.dataValues.lastname}`
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
  async unfollow(req, res) {
    const followerId = req.userId;
    const followedUserId = req.params.userId;
    try {
      const user = await userHelper.throwErrorOnNonExistingUser(followedUserId);
      const userUnfollow = await FollowersTable.destroy({ where: { followerId, followedUserId } });
      if (userUnfollow === 0) throw new Error('You\'re not following this user');
      res.status(201).send({
        message: `You unfollowed ${user.dataValues.firstname} ${user.dataValues.lastname}`
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
  async listOfFollowedUsers(req, res) {
    const { userId } = req.params;
    try {
      await userHelper.throwErrorOnNonExistingUser(userId);
      const followedUsers = await FollowersTable.findAndCountAll({
        where: { followerId: userId },
        attributes: { exclude: ['followerId', 'followedUserId'] },
        include: {
          model: User,
          as: 'followedUser',
          attributes: {
            include: [['id', 'userId']],
            exclude: ['password', 'createdAt', 'updatedAt', 'role', 'id']
          }
        }
      });
      res.status(200).send({
        data: {
          followedUsers: followedUsers.rows,
          followedUsersCount: followedUsers.count
        },
        message: 'Retrieved followed users'
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
  async listOfFollowers(req, res) {
    const { userId } = req.params;
    try {
      await userHelper.throwErrorOnNonExistingUser(userId);
      const followers = await FollowersTable.findAndCountAll({
        where: { followedUserId: userId },
        attributes: { exclude: ['followedUserId'] },
        include: {
          model: User,
          as: 'follower',
          attributes: {
            include: [['id', 'userId']],
            exclude: ['password', 'createdAt', 'updatedAt', 'role', 'id']
          }
        }
      });
      res.status(200).send({
        data: {
          followers: followers.rows,
          followersCount: followers.count
        },
        message: 'Retrieved followers'
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
};
