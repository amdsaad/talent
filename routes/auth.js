const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const keys = require('../config/keys');



// Load User Model
require('../models/User');
const User = mongoose.model('users');

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook', {
    successRedirect: req.session.returnTo || '/',
    failureRedirect: '/login'
  })(req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect(req.session.returnTo || '/dashboard')
    delete req.session.returnTo;
  });

router.get('/login', (req, res) => {
  if (req.user) {
    req.flash('error_msg', 'user already signed in, Please log out first:)');
    res.redirect('/dashboard');
  } else {
    res.render('index/login');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

///////////**** Employer******////////////////////////////////////

router.get('/employers/register', (req, res) => {
  if (req.user) {
    req.flash('error_msg', 'user already signed in, Please log out first:)');
    res.redirect('/dashboard');
  }
  else {
    res.render('employers/register');

  }
});
// User Login Route
router.get('/employers/login', (req, res) => {
  if (req.user) {
    req.flash('error_msg', 'user already signed in, Please log out first:)');
    res.redirect('/dashboard');
  } else {
    res.render('employers/login');
  }
});
// Login Form POST
router.post('/employers/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user.role == 'candidate') {
      req.flash('error_msg', 'invalid Employer login');
      return res.redirect('/auth/login');
    } else {
      passport.authenticate('local', {
        successRedirect: '/employer-dashboard',
        failureRedirect: '/auth/employers/login',
        failureFlash: true
      })(req, res, next);
    }
  });
});
// Register Form POST
router.post('/employers/register', async (req, res) => {
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
          let sCode = Math.random().toString(36).substring(7);
          let sCodeExpires = Date.now() + 3600000; // 1 hour
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: 'employer',
            secretCode: sCode,
            secretCodeExpires: sCodeExpires,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(employer => {
                  var code = employer.secretCode.toUpperCase();
                  var smtpTransport = nodemailer.createTransport({
                    host: 'smtp.office365.com', // Office 365 server
                    port: 587,     // secure SMTP
                    secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
                    auth: {
                      user: keys.outlook.user,
                      pass: keys.outlook.pass
                    },
                    tls: {
                      ciphers: 'SSLv3'
                    }
                  });
                  const output = `
                  <p>Hello ${employer.name}</p>
                  <h4>PLease activate your account</h4>
                  <h5>SECRET CODE : ${code}</h5>
                  <p>this code is valid for 1 hour only</p>
                `;
                  var mailOptions = {
                    to: employer.email,
                    from: '"account@TL" <hello@talentliken.com>',
                    subject: 'Talentliken : Account Activation ☺️',
                    html: output,
                  };
                  smtpTransport.sendMail(mailOptions, function (err) {
                    console.log('mail sent');
                    req.flash('success_msg', 'An e-mail has been sent to ' + employer.email + ' with the scret code.');
                    res.redirect(`/auth/employer/activate/${employer._id}`);
                  })
                })
                .catch(err => {
                  console.log(err);
                });
            });
          });
        }
      });
  }
});

router.get('/employer/activate/:id', (req, res) => {
  User.findOne({ _id: req.params.id, secretCodeExpires: { $gt: Date.now() } }, function (err, employer) {
    if (employer) {
      res.render('employers/activate', {
        employer,
      })
    } else {
      User.findOne({ _id: req.params.id }, function (err, regUser) {
        if (!regUser) {
          req.flash('error_msg', 'Invalid user, you can register below');
          res.redirect(`/auth/employers/register`);
        } else {
          req.flash('error_msg', 'Secret code has expired, please reset your code below.');
          res.redirect(`/auth/employer/code-reset/${req.params.id}`);
        }
      });
    }
  })
});

router.post('/employer/activate/:id', (req, res) => {
  User.findOne({ _id: req.params.id, secretCodeExpires: { $gt: Date.now() } }, function (err, employer) {
    if (!employer) {
      User.findOne({ _id: req.params.id }, function (err, regUser) {
        if (!regUser) {
          req.flash('error_msg', 'Invalid user, you can register below');
          res.redirect(`/auth/employers/register`);
        } else {
          req.flash('error_msg', 'Secret code has expired, please reset your code below.');
          res.redirect(`/auth/employer/code-reset/${req.params.id}`);
        }
      });
    } else {
      var code = req.body.secretCode.toLowerCase();
      if (code == employer.secretCode) {
        employer.active = true;
        employer.secretCode = undefined;
        employer.secretCodeExpires = undefined;
        employer.save().then(employer => {
          req.flash('success_msg', 'Your Account is activate, you can login now.');
          res.redirect('/auth/employers/login')
        })
      } else if (code != employer.secretCode) {
        req.flash('error_msg', 'invalid secret code, please check your code and try again');
        res.redirect(`/auth/employer/activate/${req.params.id}`);
      }
    }
  });
});

router.get('/employer/code-reset/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, function (err, employer) {
    res.render('employers/codeReset', {
      employer,
    })
  });
});

router.post('/employer/code-reset/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, function (err, employer) {
    if (!employer) {
      req.flash('error_msg', 'Invalid user');
      res.redirect(`/`);
    } else {
      let sCode = Math.random().toString(36).substring(7);
      let sCodeExpires = Date.now() + 3600000; // 1 hour
      employer.secretCode = sCode;
      employer.secretCodeExpires = sCodeExpires;
      employer.save()
        .then(employer => {
          var code = employer.secretCode.toUpperCase();
          var smtpTransport = nodemailer.createTransport({
            host: 'smtp.office365.com', // Office 365 server
            port: 587,     // secure SMTP
            secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
            auth: {
              user: keys.outlook.user,
              pass: keys.outlook.pass
            },
            tls: {
              ciphers: 'SSLv3'
            }
          });
          const output = `
        <p>Hello ${employer.name}</p>
        <h4>PLease activate your account</h4>
        <h5>SECRET CODE : ${code}</h5>
        <p>this code is valid for 1 hour only</p>
      `;
          var mailOptions = {
            to: employer.email,
            from: '"account@TL" <hello@talentliken.com>',
            subject: 'Talentliken : New Secret Code ☺️',
            html: output,
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            console.log('mail sent');
            req.flash('success_msg', 'An e-mail has been sent to ' + employer.email + ' with NEW scret code.');
            res.redirect(`/auth/employer/activate/${employer._id}`);
          })
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

});

///////////**** Candidate******////////////////////////////////////
router.get('/candidate/register', (req, res) => {
  if (req.user) {
    req.flash('error_msg', 'user already signed in, Please log out first:)');
    res.redirect('/dashboard');
  }
  else {
    res.render('candidate/register');
  }
});
// Login Form POST
router.post('/candidate/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user.role == 'employer') {
      req.flash('error_msg', 'invalid candidate login');
      res.redirect('/auth/login');
    } else {
      passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
      })(req, res, next);

    }
  });
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
      .then(candidate => {
        if (candidate) {
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/auth/candidate/register');
        } else {
          let sCode = Math.random().toString(36).substring(7);
          let sCodeExpires = Date.now() + 3600000; // 1 hour          
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            secretCode: sCode,
            secretCodeExpires: sCodeExpires,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(candidate => {
                  var code = candidate.secretCode.toUpperCase();
                  var smtpTransport = nodemailer.createTransport({
                    host: 'smtp.office365.com', // Office 365 server
                    port: 587,     // secure SMTP
                    secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
                    auth: {
                      user: keys.outlook.user,
                      pass: keys.outlook.pass
                    },
                    tls: {
                      ciphers: 'SSLv3'
                    }
                  });
                  const output = `
                  <p>Hello ${candidate.name}</p>
                  <h4>PLease activate your account</h4>
                  <h5>SECRET CODE : ${code}</h5>
                  <p>this code is valid for 1 hour only</p>
                `;
                  var mailOptions = {
                    to: candidate.email,
                    from: '"account@TL" <hello@talentliken.com>',
                    subject: 'Talentliken : Account Activation ☺️',
                    html: output,
                  };
                  smtpTransport.sendMail(mailOptions, function (err) {
                    console.log('mail sent');
                    req.flash('success_msg', 'An e-mail has been sent to ' + candidate.email + ' with the scret code.');
                    res.redirect(`/auth/candidate/activate/${candidate._id}`);
                  })
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

router.get('/candidate/activate/:id', (req, res) => {
  User.findOne({ _id: req.params.id, secretCodeExpires: { $gt: Date.now() } }, function (err, candidate) {
    if (candidate) {
      res.render('candidate/activate', {
        candidate,
      })
    } else {
      User.findOne({ _id: req.params.id }, function (err, regUser) {
        if (!regUser) {
          req.flash('error_msg', 'Invalid user, you can register below');
          res.redirect(`/auth/candidate/register`);
        } else {
          req.flash('error_msg', 'Secret code has expired, please reset your code below.');
          res.redirect(`/auth/candidate/code-reset/${req.params.id}`);
        }
      });
    }
  })
});

router.post('/candidate/activate/:id', (req, res) => {
  User.findOne({ _id: req.params.id, secretCodeExpires: { $gt: Date.now() } }, function (err, candidate) {
    if (!candidate) {
      User.findOne({ _id: req.params.id }, function (err, regUser) {
        if (!regUser) {
          req.flash('error_msg', 'Invalid user, you can register below');
          res.redirect(`/auth/candidate/register`);
        } else {
          req.flash('error_msg', 'Secret code has expired, please reset your code below.');
          res.redirect(`/auth/candidate/code-reset/${req.params.id}`);
        }
      });
    } else {
      var code = req.body.secretCode.toLowerCase();
      if (code == candidate.secretCode) {
        candidate.active = true;
        candidate.secretCode = undefined;
        candidate.secretCodeExpires = undefined;
        candidate.save().then(candidate => {
          req.flash('success_msg', 'Your Account is activate, you can login now.');
          res.redirect('/auth/login')
        })
      } else if (code != candidate.secretCode) {
        req.flash('error_msg', 'invalid secret code, please check your code and try again');
        res.redirect(`/auth/candidate/activate/${req.params.id}`);
      }
    }
  });
});

router.get('/candidate/code-reset/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, function (err, candidate) {
    res.render('candidate/codeReset', {
      candidate,
    })
  });
});

router.post('/candidate/code-reset/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, function (err, candidate) {
    if (!candidate) {
      req.flash('error_msg', 'Invalid user');
      res.redirect(`/`);
    } else {
      let sCode = Math.random().toString(36).substring(7);
      let sCodeExpires = Date.now() + 3600000; // 1 hour
      candidate.secretCode = sCode;
      candidate.secretCodeExpires = sCodeExpires;
      candidate.save()
        .then(candidate => {
          var code = candidate.secretCode.toUpperCase();
          var smtpTransport = nodemailer.createTransport({
            host: 'smtp.office365.com', // Office 365 server
            port: 587,     // secure SMTP
            secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
            auth: {
              user: keys.outlook.user,
              pass: keys.outlook.pass
            },
            tls: {
              ciphers: 'SSLv3'
            }
          });
          const output = `
        <p>Hello ${candidate.name}</p>
        <h4>PLease activate your account</h4>
        <h5>SECRET CODE : ${code}</h5>
        <p>this code is valid for 1 hour only</p>
      `;
          var mailOptions = {
            to: candidate.email,
            from: '"account@TL" <hello@talentliken.com>',
            subject: 'Talentliken : New Secret Code ☺️',
            html: output,
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            console.log('mail sent');
            req.flash('success_msg', 'An e-mail has been sent to ' + candidate.email + ' with NEW scret code.');
            res.redirect(`/auth/employer/activate/${candidate._id}`);
          })
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

});
///////////**** Candidate END******////////////////////////////////////

//forgot password
router.get('/forgot', function (req, res) {
  if (req.isAuthenticated()) {
    req.logout();
    req.flash('error_msg', 'logged out to reset your password');
    res.redirect('/auth/forgot');
  } else {
    res.render('index/forgot');
  }
});

router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash('error_msg', 'No account with that email address exists.');
          return res.redirect('/auth/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
          user: keys.outlook.user,
          pass: keys.outlook.pass
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });
      var mailOptions = {
        to: user.email,
        from: '"account@TL" <hello@talentliken.com>',
        subject: 'Talentliken : Password reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/auth/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log('mail sent');
        req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/auth/forgot');
  });
});

router.get('/reset/:token', function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('/auth/forgot');
    }
    res.render('index/reset', { token: req.params.token });
  });
});

router.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error_msg', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        } else if (req.body.password === req.body.confirm) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save()
                .then(user => {
                  req.logIn(user, function (err) {
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
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
          user: keys.outlook.user,
          pass: keys.outlook.pass
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });
      var mailOptions = {
        to: user.email,
        from: '"account@TL" <hello@talentliken.com>',
        subject: 'Talentliken : Password changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('success_msg', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function (err) {
    res.redirect('/');
  });
});

module.exports = router;