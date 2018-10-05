const db = require('../models');

const { User } = db;

module.exports = {
  resetDB() {
    User.destroy({ where: {}, truncate: { cascade: true } });
  }
};
