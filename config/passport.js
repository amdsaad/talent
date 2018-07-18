const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

//losad user moel
const User = mongoose.model('users');

module.exports = function (passport) {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });

  passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: keys.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
    (req, token, refreshToken, profile, done) => {
      User.findOne({ facebook: profile.id }, function (err, user) {
        if (user) {
          return done(null, user)
        } else {
          const newUser = new User();
          newUser.email = profile._json.email;
          newUser.facebook = profile.id;
          newUser.tokens.push({ kind: 'facebook', token: token });
          newUser.name = profile.displayName;
          newUser.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

          newUser.save(function (err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }));
}