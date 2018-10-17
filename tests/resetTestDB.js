const db = require('../models');

const { User, FollowersTable, Reactions } = db;

module.exports = {
  resetDB() {
    Reactions.destroy({ truncate: true, cascade: true });
    FollowersTable.destroy({ truncate: true, cascade: true });
    User.destroy({ truncate: true, cascade: true });
  },
};
