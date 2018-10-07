const db = require('../models');

const { User, UserFollow } = db;

module.exports = {
  async findUser(email) {
    const existingUser = await User.findOne({ where: { email } });
    return existingUser;
  },
  async throwErrorIfFollowed(followerId, followedId) {
    const existingFollow = await UserFollow.findOne({ where: { followerId, followedId } });
    if (existingFollow) throw new Error('existingFollow');
  },
};
