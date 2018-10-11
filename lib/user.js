const db = require('../models');

const { User, FollowersTable } = db;

module.exports = {
  async findUser(email) {
    const existingUser = await User.findOne({ where: { email } });
    return existingUser;
  },
  async throwErrorOnBadRequest(followerId, followedUserId) {
    if (Number(followedUserId) === Number(followerId)) throw new Error('Error: You cannot follow yourself');
    const existingFollow = await FollowersTable.findOne({ where: { followerId, followedUserId } });
    if (existingFollow) throw new Error('Error: You\'re already following this user');
  },
  async throwErrorOnNonExistingUser(userId) {
    const existingUser = await User.findById(userId);
    if (!existingUser) throw new Error('Error: User doen\'t exist');
    return existingUser;
  },
};
