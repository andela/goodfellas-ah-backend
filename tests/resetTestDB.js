const db = require('../models');

const { User, UserRelationship } = db;

module.exports = {
  resetDB() {
    UserRelationship.destroy({ truncate: true, cascade: true });
    User.destroy({ truncate: true, cascade: true });
  },
};
