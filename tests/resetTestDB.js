const db = require('../models');

const { User, UserFollow } = db;

module.exports = {
  resetDB() {
    UserFollow.destroy({ truncate: true, cascade: true });
    User.destroy({ truncate: true, cascade: true });
  },
};
