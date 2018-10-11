import { config } from 'dotenv';
import passport from 'passport';
import GooglePlusTokenStrategy from 'passport-google-oauth20';

import MockedStrategy from '../../lib/mockStrategy';
import utility from '../../lib/utility';

// Initialize the dotenv package to handle all environment variables
config();

// Create a placeholder variable to store strategy to be exported
let strategy;

// Configure the Google passport strategy and pass the callback as an handler
passport.use('google', new GooglePlusTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/google/callback'
}, utility.strategyCallback));

/* For testing purposes configure a mock strategy

These articles guided in implementing the mock strategy
https://gist.github.com/mweibel/5219403
https://medium.com/chingu/mocking-passport-githubstrategy-for-functional-testing-33e7ed4f9aa3
*/
passport.use(new MockedStrategy('google-test', utility.strategyCallback));

// Configure which strategy gets used based on the environment
if (process.env.NODE_ENV === 'test') {
  strategy = 'google-test';
} else {
  strategy = 'google';
}

module.exports = strategy;
