const db = require('../models');

const { User } = db;

module.exports = {
  async findUser(email) {
    const existingUser = await User.findOne({ where: { email } });
    return existingUser;
  },
};
