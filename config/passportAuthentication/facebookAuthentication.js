import { config } from 'dotenv';
import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook';

import MockedStrategy from '../../lib/mockStrategy';
import utility from '../../lib/utility';

// Initialize the dotenv package to handle all environment variables
config();

// Create a placeholder variable to store strategy to be exported
let strategy;

// Configure the facebook passport strategy and pass the callback as an handler

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  profileFields: ['id', 'name', 'displayName', 'email'],
  callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`
}, utility.strategyCallback));

/* For testing purposes configure a mock strategy

These articles guided in implementing the mock strategy
https://gist.github.com/mweibel/5219403
https://medium.com/chingu/mocking-passport-githubstrategy-for-functional-testing-33e7ed4f9aa3
*/
passport.use(new MockedStrategy('facebook-test', utility.strategyCallback));

// Configure which strategy gets used based on the environment
if (process.env.NODE_ENV === 'test') {
  strategy = 'facebook-test';
} else {
  strategy = 'facebook';
}

module.exports = strategy;
