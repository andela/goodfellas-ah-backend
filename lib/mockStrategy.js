/* eslint-disable no-shadow */
const passport = require('passport');

const user = require('./mockUser');

let currentUser;
let count = 0;

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
    if (name === 'facebook') {
      currentUser = user.facebook;
    }

    if (name === 'google') {
      currentUser = user.google;
    }

    super(name, strategyCallback);
    this.name = name;
    this.user = currentUser;
    this.cb = strategyCallback;
  }

  /**
  * @param {object}  req - This should contain the request body
  * @returns {object} - returns the user that has been authenticated
  */
  authenticate(req) {
    if (req.body.access_token === this.user.token) {
      if (this.user.id) {
        count += 1;
      }

      if (count === 3 || count === 6) {
        this.user.id = 'randomwrongid';
      }
      this.cb(null, null, this.user, (error, user) => {
        this.success(user);
      });
    } else {
      this.fail('Unauthorized');
    }
  }
}

module.exports = Strategy;
