const db = require('../models');

const { Profiles } = db;

module.exports = {
  async findProfile(userId) {
    const existingUser = await Profiles.findOne({ where: { userId } });
    return existingUser;
  },
};
