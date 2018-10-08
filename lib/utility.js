const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  async encryptPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },
  async comparePasswords(password, userPassword) {
    const match = await bcrypt.compare(password, userPassword);
    return match;
  },
  createToken(user) {
    return jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
  },
  trimValues(values) {
    const newValues = {};
    Object.keys(values).map((key) => {
      newValues[key] = values[key].trim();
      return newValues;
    });
    return newValues;
  },
  testRules: {
    fullname: {
      rules: [{ minLength: 5 }, { dataType: 'string' }],
      trim: true,
      required: true
    },
    email: {
      rules: [{ dataType: 'email' }],
      trim: true
    },
  }
};
