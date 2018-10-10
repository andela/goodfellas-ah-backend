import { config } from 'dotenv';
import passport from 'passport';
import TwitterTokenStrategy from 'passport-twitter';

import MockedStrategy from '../../lib/mockStrategy';

// Initialize the dotenv package to handle all environment variables
config();

// Create a placeholder variable to store strategy to be exported
let strategy;

// Define callback to be passed to successful strategies
const strategyCallback = async (token, tokenSecret, profile, done) => {
  // Get access to the user details and send it to the controller
  console.log(profile);
  try {
    const user = {
      firstName: '',
      lastName: '',
      email: profile.emails[0].value,
      password: profile.id,
      account_type: profile.provider,
      username: profile.username
    };
    done(null, user);
  } catch (error) {
    done(error, false, error.message);
  }
};

// Configure the facebook passport strategy and pass the callback as an handler

passport.use('twitter', new TwitterTokenStrategy({
  consumerKey: process.env.TWITTER_CLIENT_ID,
  consumerSecret: process.env.TWITTER_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
  includeEmail: true
}, strategyCallback));

/* For testing purposes configure a mock strategy

These articles guided in implementing the mock strategy
https://gist.github.com/mweibel/5219403
https://medium.com/chingu/mocking-passport-githubstrategy-for-functional-testing-33e7ed4f9aa3
*/
passport.use(new MockedStrategy('twitter-test', strategyCallback));

// Configure which strategy gets used based on the environment
if (process.env.NODE_ENV === 'test') {
  strategy = 'twitter-test';
} else {
  strategy = 'twitter';
}

module.exports = strategy;
