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
    switch (name) {
      case '':
      case undefined:
      case null:
        throw new TypeError('DevStrategy requires a Strategy name');
      case 'facebook-test':
        currentUser = user.facebook;
        break;
      case 'google-test':
        currentUser = user.google;
        break;
      case 'twitter-test':
        currentUser = user.twitter;
        break;
      default:
        break;
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
      count += 1;

      if (count === 3 || count === 7 || count === 11) {
        this.user.id = 'randomwrongid';
      }

      if (count === 4 || count === 8 || count === 12) {
        this.user.emails[0].value = undefined;
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
