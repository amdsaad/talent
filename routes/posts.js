const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Stories Index
router.get('/', (req, res) => {
  Post.find({ status: 'public' })
    .populate('user')
    .populate('comments.commentUser')
    .sort({ date: 'desc' })
    .then(posts => {
      res.render('posts/index', {
        posts: posts
      });
    });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
    .populate('user')
    .populate('comments.commentUser')
    .then(post => {
      if (post.status == 'public') {
        res.render('posts/show', {
          post: post
        });
      } else {
        if (req.user) {
          if (req.user.id == post.user._id) {
            res.render('posts/show', {
              post: post
            });
          } else {
            res.redirect('/posts');
          }
        } else {
          res.redirect('/posts');
        }
      }
    });
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
  Post.find({ user: req.params.userId, status: 'public' })
    .populate('user')
    .then(posts => {
      res.render('posts/index', {
        posts: posts
      });
    });
});

// Logged in users stories
router.get('/my', ensureAuthenticated, (req, res) => {
  Post.find({ user: req.user.id })
    .populate('user')
    .then(posts => {
      res.render('posts/index', {
        post: posts
      });
    });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('posts/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
    .then(post => {
      if (post.user != req.user.id) {
        res.redirect('/posts');
      } else {
        res.render('posts/edit', {
          post: post
        });
      }
    });
});

// Edit Form Process
router.put('/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
    .then(post => {
      let allowComments;

      if (req.body.allowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }

      // New values
      post.title = req.body.title;
      post.body = req.body.body;
      post.status = req.body.status;
      post.allowComments = allowComments;

      post.save()
        .then(post => {
          res.redirect('/dashboard');
        });
    });
});

// Process Add Post
router.post('/', (req, res) => {
  const newPost = {
    title: req.body.title,
    image: req.body.image,
    body: req.body.body,
    status: req.body.status,
    allowComments: true,
    user: req.user.id,
    userName: req.user.name,
    userImage: req.user.picture,

  }
  // Create Post
  new Post(newPost)
    .save()
    .then(post => {
      res.json(post);
      console.log(post);
    });
});
// Process Add Story
router.post('/api', (req, res) => {
  const newPost = {
    title: req.body.title,
    image: req.body.image,
    body: req.body.body,
    status: req.body.status,
    user: req.body.id
  }

  // Create Story
  new Post(newPost)
    .save()
    .then(post => {
      res.redirect(`/posts/show/${post.id}`);
    });


});



// Delete Story
router.delete('/:id', (req, res) => {
  Post.remove({ _id: req.params.id })
    .then(() => {
      res.redirect('/dashboard');
    });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }
      // Add to comments array
      post.comments.unshift(newComment);

      post.save()
        .then(post => {
          res.json(post)
        });
    });
});

module.exports = router;