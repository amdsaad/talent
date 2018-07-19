const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cv = mongoose.model('cvs');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// Stories Index
router.get('/', (req, res) => {
  Cv.find({status:'public'})
    .populate('user')
    .sort({date:'desc'})
    .then(cvs => {
      res.render('cvs/index', {
        cvs: cvs
      });
    });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Cv.findOne({
    _id: req.params.id
  })
  .then(cv => {
    if(cv.status == 'public'){
      res.render('cvs/show',{
        cv:cv
      })
    }
  });
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
  Cv.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(cvs => {
      res.render('cvs/index', {
        cvs:cvs
      });
    });
});

// Logged in users stories
router.get('/my', ensureAuthenticated, (req, res) => {
  Cv.find({user: req.user.id})
    .populate('user')
    .then(cvs => {
      res.render('cvs/index', {
        cvs:cvs
      });
    });
});

// Add Story Form
router.get('/add',  (req, res) => {
  res.render('cvs/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Cv.findOne({
    _id: req.params.id
  })
  .then(cv => {
    if(cv.user != req.user.id){
      res.redirect('/cvs');
    } else {
      res.render('cvs/edit', {
        cv: cv
      });
    }
  });
});

// Process Add Story
router.post('/', (req, res) => {
 
  const newCv = {
    fullName: req.body.fullName,
    userId: req.body.userId,// FB userID coming form Manychat
    photo: req.body.photo,
    phone: req.body.phone,
    email: req.body.email,
    location: req.body.location,
    currentRole: req.body.currentRole,
    desiredRole: req.body.desiredRole,
    description: req.body.description,
    videoResumeUri: req.body.videoResumeUri,
    specialisms: req.body.specialisms,
    education: req.body.education,
    yearsOfExperiance: req.body.yearsOfExperiance,
    languages: req.body.languages,
    skills: req.body.skills,
    hoppies: req.body.hoppies,
    status: req.body.status,
    user: req.user.id
  }
  // Create Story
  new Cv (newCv)
    .save()
    .then(cv => {
      res.status(200).json(cv);
    });
});


/* // Edit Form Process
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    let allowComments;
    
    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
      .then(story => {
        res.redirect('/dashboard');
      });
  });
}); */

/* // Delete Story
router.delete('/:id', (req, res) => {
  Story.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/dashboard');
    });
}); */

/* // Add Comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }

    // Add to comments array
    story.comments.unshift(newComment);

    story.save()
      .then(story => {
        res.redirect(`/stories/show/${story.id}`);
      });
  });
}); */

module.exports = router;