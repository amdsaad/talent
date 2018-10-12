const passport = require('passport');
const bcrypt = require('bcryptjs');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');
const keys = require('./keys');
 
//load user moel
const User = mongoose.model('users');

module.exports = function (passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  }); 

  passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: '/auth/facebook/callback',
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

  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, (accessToken, refreshToken, profile, done) => {
    // console.log(accessToken);
    // console.log(profile);

    const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

    const newUser = {
      email: profile.emails[0].value,
      googleID: profile.id,
      name: profile.name.givenName + " " + profile.name.familyName,
      picture: image
    }

    // Check for existing user
    User.findOne({
      googleID: profile.id
    }).then(user => {
      if (user) {
        // Return user
        done(null, user);
      } else {
        // Create user
        new User(newUser)
          .save()
          .then(user => done(null, user));
      }
    })
  })
  );
}