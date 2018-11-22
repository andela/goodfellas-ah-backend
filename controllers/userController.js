import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models';
import utility from '../lib/utility';
import helper from '../lib/helper';
import becomeAdmin from '../lib/admin';
import profileController from './profileController';
import mail from '../lib/verifyEmail';

dotenv.config();
const {
  User,
  FollowersTable,
  sequelize,
  UserNotification,
  Profiles,
} = db;

export default {
  async signup(req, res) {
    try {
      const values = utility.trimValues(req.body);
      const {
        firstname, lastname, email, password
      } = values;

      const existingUser = await helper.findRecord(User, {
        email
      });

      if (existingUser) {
        return res.status(409).send({ message: 'Email is in use' });
      }
      if (email === process.env.email) {
        return becomeAdmin(req, res);
      }

      const encryptedPassword = await utility.encryptPassword(password);
      const encryptedToken = utility.encryptToken();

      User.create({
        firstname,
        lastname,
        email,
        password: encryptedPassword,
        verification_token: encryptedToken
      })
        .then((newUser) => {
          profileController.createProfile(newUser);
          utility.sendEmail(newUser.email, mail(encryptedToken));
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

    const existingUser = await helper.findRecord(User, {
      email
    });

    if (!existingUser) {
      return res.status(400).send({ message: 'The account with this email does not exist' });
    }

    const match = await utility.comparePasswords(password, existingUser.dataValues.password);

    if (match) {
      res.status(200).send({
        message: 'Successfully signed in',
        token: utility.createToken(existingUser.dataValues),
        userId: existingUser.id
      });
    } else {
      res.status(400).send({ message: 'Incorrect email or password' });
    }
  },
  async socialAuth(req, res) {
    // Check if user exists
    const existingUser = await helper.findRecord(User, {
      email: req.user.email
    });

    if (existingUser) {
      // If Yes, check if it was with the same social account
      const { password } = req.user;

      const match = await utility.comparePasswords(password, existingUser.dataValues.password);
      // If yes then authenticate user
      if (match) {
        res.redirect(`${process.env.CLIENT_URL}/auth/social?token=${utility.createToken(existingUser.dataValues)}&userId=${existingUser.id}`);
      } else {
        // If no, return error message
        res.status(400).send({ message: "You can't login through this platform" });
      }
    } else {
      // If No, create user then authenticate user
      const encryptedPassword = await utility.encryptPassword(req.user.password);
      const encryptedToken = utility.encryptToken();

      User.create({
        firstname: req.user.firstName,
        lastname: req.user.lastName,
        email: req.user.email,
        password: encryptedPassword,
        verification_token: encryptedToken,
        account_type: req.user.account_type
      })
        .then((newUser) => {
          profileController.createProfile(newUser);
          utility.sendEmail(newUser.email, mail(encryptedToken));
          res.redirect(`${process.env.CLIENT_URL}/auth/social?token=${utility.createToken(newUser.dataValues)}&userId=${newUser.id}`);
        })
        .catch(() => res.status(500).send({ error: 'Internal server error' }));
    }
  },

  async follow(req, res) {
    const followerId = req.userId;
    const followedUserId = req.params.userId;
    try {
      const user = await helper.throwErrorOnNonExistingUser(followedUserId);
      await helper.throwErrorOnBadRequest(followerId, followedUserId);
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
      const user = await helper.throwErrorOnNonExistingUser(followedUserId);
      const userUnfollow = await FollowersTable.destroy({ where: { followerId, followedUserId } });
      if (userUnfollow === 0) throw new Error("You're not following this user");
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
      await helper.throwErrorOnNonExistingUser(userId);
      const followedUsers = await FollowersTable.findAndCountAll({
        where: { followerId: userId },
        attributes: { exclude: ['followerId'] },
        include: {
          model: User,
          as: 'followedUser',
          attributes: ['firstname', 'lastname', 'email', 'role'],
          include: {
            model: Profiles,
            as: 'profile'
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
      await helper.throwErrorOnNonExistingUser(userId);
      const followers = await helper.getFollowers(userId);
      res.status(200).send({
        data: {
          followers: followers.followers,
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
  async forgotPassword(req, res) {
    const user = await helper.findRecord(User, {
      email: req.email
    });
    if (!user) {
      return res.status(404).send({
        message: 'The account with this email does not exist'
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 60 * 60 });
    const expiration = new Date(Date.now() + (60 * 60 * 1000));
    const mailMessage = `Click <a href="${process.env.CLIENT_URL}/resetPassword?token=
  ${token}">here</a> to reset your password`;
    user.update({ password_reset_token: token, password_reset_time: expiration }).then(async () => {
      const message = { message: 'An email has been sent to your account', token };
      const sentMail = utility.sendEmail(req.email, mailMessage);
      if (sentMail) {
        return res.status(200).send(message);
      }
    });
  },

  async resetPassword(req, res) {
    const encryptedPassword = await utility.encryptPassword(req.body.password.trim());
    return req.user
      .update({
        password: encryptedPassword,
        password_reset_time: null,
        password_reset_token: null
      })
      .then(async (user) => {
        const mailMessage = 'Your password has been reset successfully';
        const message = { message: 'Password reset successful' };
        const sentMail = await utility.sendEmail(user.email, mailMessage);
        if (sentMail) {
          return res.status(200).send(message);
        }
      });
  },

  async verifyUser(req, res) {
    // Get token sent in params
    const { verificationToken } = req.params;
    // Check if there is a user with that token and that hasn't been verified
    try {
      const checkToken = await User.findOne({
        where: { verification_token: verificationToken, verified: false }
      });

      if (checkToken) {
        // If yes, then verify that user
        checkToken
          .update({ verified: true, verification_token: null })
          .then(() => res.status(200).send({ message: 'Account successfully verified' }))
          // Catch errors
          .catch(() => res.status(500).send({ message: 'Your account cannot be verified at the moment, Please try again later' }));
      } else {
        // If no, then return error
        res.status(403).send({ message: 'Your account has already been verified.' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Internal server error' });
    }
  },
  async setNotification(req, res) {
    const { userId } = req;
    const { setting } = req.params;
    try {
      const currentSettings = await User.find({ where: { id: userId }, attributes: ['notificationSettings'] });
      const settingIndex = currentSettings.notificationSettings
        .findIndex(element => element === setting);
      if (settingIndex > -1) throw new Error('You already have this setting enabled');
      await User.update({ notificationSettings: sequelize.fn('array_append', sequelize.col('notificationSettings'), setting) }, { where: { id: userId } });
      res.status(200).send({
        message: 'Notification setting successfully updated'
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
  async unsetNotification(req, res) {
    const { userId } = req;
    const { setting } = req.params;
    try {
      const currentSettings = await User.find({ where: { id: userId }, attributes: ['notificationSettings'] });
      const settingIndex = currentSettings.notificationSettings
        .findIndex(element => element === setting);
      if (settingIndex === -1) throw new Error('You currently do not have this setting enabled');
      await User.update({ notificationSettings: sequelize.fn('array_remove', sequelize.col('notificationSettings'), setting) }, { where: { id: userId } });
      res.status(200).send({
        message: 'Notification setting successfully updated'
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
  async getNotifications(req, res) {
    const { userId } = req;
    try {
      const notifications = await helper.getNotifications({ userId });
      res.status(200).send({
        message: 'Notifications retrieved successfully',
        data: notifications,
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
  async getNotification(req, res) {
    const { userId } = req;
    const { notificationId } = req.params;
    try {
      const notifications = await helper.getNotification({ userId, id: notificationId });
      res.status(200).send({
        message: 'Notification retrieved successfully',
        data: notifications,
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
  async seenNotification(req, res) {
    const { userId } = req;
    const { notificationId } = req.params;
    try {
      await UserNotification.update(
        { seen: true },
        {
          where: { userId, id: notificationId }
        }
      );
      res.status(201).send({
        message: 'Notification has been seen',
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  },
};
