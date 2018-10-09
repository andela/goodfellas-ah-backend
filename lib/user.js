const db = require('../models');

const { User, FollowersTable } = db;

module.exports = {
  async findUser(email) {
    const existingUser = await User.findOne({ where: { email } });
    return existingUser;
  },
  async throwErrorOnBadRequest(followerId, followedId) {
    if (Number(followedId) === Number(followerId)) throw new Error('Error: You cannot follow yourself');
    const existingUser = await User.findOne({ where: { id: followedId } });
    if (!existingUser) throw new Error('Error: User doen\'t exist');
    const existingFollow = await FollowersTable.findOne({ where: { followerId, followedId } });
    if (existingFollow) throw new Error('Error: You\'re already following this user');
  },
};
