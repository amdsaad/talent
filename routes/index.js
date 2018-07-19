const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .then(stories => {
      res.render('index/dashboard', {
        stories: stories
      });
    });
});

router.get('/users/:email', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  User.findOne({ email: req.params.email })
    .then(user => {
      res.status(200).json({
        "version": "v2",
        "content": {
          "actions": [
            {
              "action": "set_field_value",
              "field_name": "_userID",
              "value": user.id
            }]
        }
      });
    });
});


router.get('/about', (req, res) => {
  res.render('index/about');
});
module.exports = router;