const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
//losad user moel
const User = mongoose.model('users');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      //console.log(accessToken);
      //console.log(profile);

      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: image
      }

      //check for existing user
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if (user) {
          //Return user
          done(null, user);
        } else {
          //create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  );

  passport.use(
    new FacebookStrategy({
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: '/auth/facebook/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      //console.log(accessToken);
      //console.log(profile);
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('profile', profile);
          console.log('accessToken', accessToken);
          console.log('refreshToken', refreshToken);
          
          const existingUser = await User.findOne({ "facebook.id": profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }
      
          const newUser = new User({
            facebookID: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value

          });
      
          await newUser.save();
          done(null, newUser);
        } catch(error) {
          done(error, false, error.message);
        }
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });


}