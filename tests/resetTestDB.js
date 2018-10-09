const db = require('../models');

const { User, FollowersTable } = db;

module.exports = {
  resetDB() {
    FollowersTable.destroy({ truncate: true, cascade: true });
    User.destroy({ truncate: true, cascade: true });
  },
};
