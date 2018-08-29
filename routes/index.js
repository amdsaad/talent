const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const Resume = mongoose.model('resumes');
const User = mongoose.model('users');
const Job = mongoose.model('jobs');
const Company = mongoose.model('companies');
const JobWanted = mongoose.model('jobWanted');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, async (req, res) => {
  const latestPosts = await Post.find({ status: 'public' }).limit(5);
  res.render('index/welcome', {
    latestPosts: latestPosts
  });
});

router.post('/job-wanted', async (req, res) => {

  const resume = await Resume.findOne({ 'user': req.user.id }).populate('user');
  var str = req.user.name;
  str = str.replace(/\s+/g, '-').toLowerCase();
  jTitle = req.body.title.replace(/\s+/g, '-').toLowerCase();
  const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const handle = jTitle + "-" + str + "-" + randomStr;

  const newJobWanted = {
    handle: handle,
    title: req.body.title,
    body: req.body.body,
    resume: resume.id,
    user: req.user.id
  }
  new JobWanted(newJobWanted)
    .save()
    .then(jobwanted => {
      res.json(jobwanted)
    });

});

router.get('/job-wanted', (req, res) => {
  res.send('All job wanted list');
})

router.get('/job-wanted/:handle', async (req, res) => {

  const jobWanted = await JobWanted.findOne({ handle: req.params.handle }).populate('user');
  res.send('Show Single Job wanted')

});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {

  if (req.user.role == 'employer') {
    employer = true;
  } else {
    employer = false;
  }

  const posts = await Post.find({ 'user': req.user.id });
  const resume = await Resume.findOne({ 'user': req.user.id }).populate('user');
  const latestPosts = await Post.find({}).limit(2).sort({ date: 'desc' });
  if(resume){
   var matchJob = resume.specialisms
  };
  const jobSpecialisms = await Job.find({ 'specialisms': matchJob }).limit(5).populate('company');

  res.render('index/dashboard', {
    posts: posts,
    resume: resume,
    latestPosts: latestPosts,
    jobSpecialisms: jobSpecialisms
  });

});
router.get('/employer-dashboard', ensureAuthenticated, async (req, res) => {

  if (req.user.role == 'candidate') {
    req.flash('error_msg', 'You Don not have permission)');
    res.redirect('/dashboard');
  } else {
    const company = await Company.findOne({ user: req.user.id });
    const jobs = await Job.find({ user: req.user.id });

      res.render('index/employer-dashboard', {
        company,
        jobs
    }); 
  }
});


router.post('/company', ensureAuthenticated, async (req, res) => {

  if (req.user.role == 'employer') {
    employer = true;
  }
  const company = await Company
    .findOne({ user: req.user.id });

  if (employer) {

    if (company) {
      req.flash('error_msg', 'You arelaedy have a company profile :)');
      res.redirect('/dashboard');
    } else {

      const newComp = {
        name: req.body.name,
        specialisms: req.body.specialisms,
        description: req.body.description,
        logo: req.body.logo,
        user: req.user.id
      }
      new Company(newComp)
        .save()
        .then(company => {
          res.redirect('/dashboard')
        });

    }
  } else {
    req.flash('error_msg', 'Opps! you dont have permission to add company profile');
    res.redirect('/dashboard');
  }
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
            },
            {
              "action": "set_field_value",
              "field_name": "facebook",
              "value": user.facebook
            },
            {
              "action": "set_field_value",
              "field_name": "picture",
              "value": user.picture
            }
          ]
        }
      });
    });
});


router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;