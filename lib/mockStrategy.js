/* eslint-disable no-shadow */
const passport = require('passport');

const user = require('./mockUser');

const token = '1234567876543' || 'abcdefgfedcba';

/**
 * Class representing a strategy
 * @extends passport.Strategy
 */
class Strategy extends passport.Strategy {
/**
 * @constructor
 * @param {string} name - the name of the strategy
 * @param {function} strategyCallback - the function to handle the callback from the strategy
 */
  constructor(name, strategyCallback) {
    if (!name || name.length === 0) {
      throw new TypeError('Strategy requires a Strategy name');
    }
    super(name, strategyCallback);
    this.name = 'mock';
    this.user = user;
    this.cb = strategyCallback;
  }

  /**
  * @param {string}  req - This should contain the access token
  * @returns {object} - returns the user that has been authenticated
  */
  authenticate(req) {
    if (req.body.access_token === token) {
      this.cb(null, null, this.user, (error, user) => {
        this.success(user);
      });
    } else {
      this.fail('uUnauthorized');
    }
  }
}

module.exports = Strategy;
