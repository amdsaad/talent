const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


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

module.exports = router;