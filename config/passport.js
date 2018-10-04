const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');

// Configure the Google passport strategy
const googleStrategy = passport.use(new GooglePlusTokenStrategy({
  clientID: '394162324941-1naldjcsruq9mmfojg3qipbm8c72mdvl.apps.googleusercontent.com',
  clientSecret: 'yXLRkfOwg9SI-Gg0eXO46GuN'
}, ((accessToken, refreshToken, profile, done) => {
  // Get access to the user details and send it to the controller
  const user = {
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value,
    password: profile.id,
    accountType: 'Google'
  };

  done(null, user);
})));

module.exports = googleStrategy;
