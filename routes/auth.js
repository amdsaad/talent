const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


// Load User Model
require('../models/User');
const User = mongoose.model('users');

router.get('/facebook',
  passport.authenticate('facebook',{scope: ['email']}));

router.get('/facebook/callback', function(req, res, next){
  passport.authenticate('facebook', { successRedirect: req.session.returnTo ||'/',
    failureRedirect: '/login' })(req, res, next);
});

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect(req.session.returnTo ||'/dashboard')
    delete req.session.returnTo;
  });

router.get('/verify', (req, res)=>{
  if(req.user){
    console.log(req.user);
  }else{
    console.log('Not Auth')
  }
});

router.get('/login', (req, res) => {
  if(req.user){
    req.flash('error_msg', 'user already signed in, Please log out first:)');
    res.redirect('/dashboard');
  }else{
    res.render('index/login');
  }
});

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});

///////////**** Employer******////////////////////////////////////

router.get('/employers/register', (req, res) => {
  if(req.user){
    req.flash('error_msg', 'user already signed in, Please log out first:)');
    res.redirect('/dashboard');
  }
  else{
    res.render('employers/register');

  }
});
// User Login Route
router.get('/employers/login', (req, res) => {
  if(req.user){
    req.flash('error_msg', 'user already signed in, Please log out first:)');
    res.redirect('/dashboard');
  }else{
    res.render('employers/login');
  }
});

// Login Form POST
router.post('/employers/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/employer-dashboard',
    failureRedirect: '/auth/employers/login',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/employers/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('employers/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    User.findOne({ email: req.body.email })
      .then(employer => {
        if (employer) {
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/auth/employers/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role:'employer'
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(employer => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/auth/employers/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

///////////**** Candidate******////////////////////////////////////
router.get('/candidate/register', (req, res) => {
  if(req.user){
    req.flash('error_msg', 'user already signed in, Please log out first:)');
    res.redirect('/dashboard');
  }
  else{
    res.render('candidate/register');

  }
});

// Login Form POST
router.post('/candidate/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/candidate/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('candidate/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    User.findOne({ email: req.body.email })
      .then(employer => {
        if (employer) {
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/auth/candidate/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(employer => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/auth/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

router.get('/forgot', function(req, res) {
  res.render('index/forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error_msg', 'No account with that email address exists.');
          return res.redirect('/auth/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'saadamd@gmail.com',
          pass: 'eazhdbudhszsxvzw'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'saadamd@gmail.com',
        subject: 'Talentliken Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/auth/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/auth/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('/auth/forgot');
    }
    res.render('index/reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error_msg', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }else if(req.body.password === req.body.confirm) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save()
              .then(user =>{
                req.logIn(user, function(err) {
                  done(err, user);
                });
              })
              .catch(err => {
                console.log(err);
                return;
              });
            });
          });
        } else {
            req.flash("error_msg", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'saadamd@gmail.com',
          pass: 'eazhdbudhszsxvzw'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'saadamd@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success_msg', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/dashboard');
  });
});

module.exports = router;