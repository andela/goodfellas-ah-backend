const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const MockedStrategy = require('../lib/mockStrategy');

require('dotenv').config();

let strategy;

// Define callback to be passed to successful strategies
const strategyCallback = ((accessToken, refreshToken, profile, done) => {
  // Get access to the user details and send it to the controller
  const user = {
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value,
    password: profile.id,
    accountType: 'Google'
  };
  done(null, user);
});

// Configure the Google passport strategy and pass the callback as an handler
passport.use(new GooglePlusTokenStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
}, strategyCallback));


/* These articles guided in implementing the mock strategy
https://gist.github.com/mweibel/5219403
https://medium.com/chingu/mocking-passport-githubstrategy-for-functional-testing-33e7ed4f9aa3

For testing purposes configure a mock strategy */
passport.use(new MockedStrategy('google', strategyCallback));

// Configure which strategy gets used based on the environment
if (process.env.NODE_ENV === 'test') {
  strategy = 'google';
} else {
  strategy = 'google-plus-token';
}

module.exports = strategy;
