const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const Resume = mongoose.model('resumes');
const User = mongoose.model('users');
const Job = mongoose.model('jobs');
const Company = mongoose.model('companies');
const JobWanted = mongoose.model('jobWanted');
const Applications = mongoose.model('applications');
const Message = mongoose.model('messages');
const moment = require('moment');
const keys = require('../config/keys');

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dgghoxlug',
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret
});

const {
  ensureAuthenticated,
  ensureGuest
} = require('../helpers/auth');

router.get('/', ensureGuest, async (req, res) => {
  const latestPosts = await Post.find({
    status: 'public'
  }).limit(5);
  res.render('index/welcome', {
    latestPosts: latestPosts,
    title: "Talent Liken : Connecting Talents - Find your job",
    metaDescription: "Talent Liken connecting Talents (job seeker and employer), join us to post free jobs or create Free Professional Resume Templates focus on increasing your visibility.",
    keywords: "find job, post a resume, build online resume, resume template, cv template, post free jobs, career advise"
  });
});

/* router.post('/job-wanted', async (req, res) => {
  const resume = await Resume.findOne({
    'user': req.user.id
  }).populate('user');
  if (!resume) {
    res.json({
      msg: "you do not have a resume, please post your resume"
    })

  } else {
    const allJobWanted = await JobWanted.find();
    const count = allJobWanted.length + 277;
    console.log(count);
    var str = req.user.name;
    str = str.replace(/\s+/g, '-').toLowerCase();
    jTitle = req.body.title.replace(/\s+/g, '-').toLowerCase();
    jDesire = req.body.desiredJob.replace(/\s+/g, '-').toLowerCase();
    const handle = jTitle + "-" + str + "-" + jDesire + "-" + count;

    const newJobWanted = {
      handle: handle,
      title: req.body.title,
      currentJob: resume.jobTitle,
      desiredJob: req.body.desiredJob,
      description: req.body.description,
      resume: resume.id,
      category: resume.specialisms,
      company: req.body.company,
      user: req.user.id
    }
    new JobWanted(newJobWanted)
      .save()
      .then(jobwanted => {
        res.json(jobwanted)
      });
  }
});
 */

/* router.get('/job-wanted/:handle', async (req, res) => {
  const jobWanted = await JobWanted.findOne({
    handle: req.params.handle
  }).populate('user').populate('resume');
  if (!jobWanted) {
    res.status(404).render('index/404');
  } else {
    res.status(200).json(jobWanted);
  }

});
 */
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const posts = await Post.find({ 'user': req.user.id });
  const resume = await Resume.findOne({ 'user': req.user.id }).populate('user');
  const latestPosts = await Post.find({}).limit(2).sort({ date: 'desc' });
  const applications = await Applications.find({ user: req.user.id }).sort({ date: 'desc' });
  if (resume) { var matchJob = resume.specialisms };
  const jobSpecialisms = await Job.find({ 'specialisms': matchJob }).limit(10).populate('company');

  res.render('index/dashboard', {
    posts: posts,
    resume: resume,
    latestPosts: latestPosts,
    jobSpecialisms: jobSpecialisms,
    applications: applications
  });

});

router.get('/employer-dashboard', async (req, res) => {
  if (!req.user) {
    req.flash('error_msg', 'Please login as employer to access this page');
    res.redirect('/auth/employers/login');
  } else if (req.user.role == 'candidate') {
    req.flash('error_msg', 'You Don not have permission to access this page');
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
  if (req.user.role == 'employer') { employer = true; }
  const company = await Company.findOne({ user: req.user.id });
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

router.get('/company/:id', async (req, res) => {
  const company = await Company.findOne({ _id: req.params.id });
  res.status(200).send('SGL company');
});

router.get('/companies', async (req, res) => {

  const comp = await Company.find();
  res.status(200).render('index/companies', {
    company: comp,
    title: "",
    metaDescription: "",
    keywords: ""
  })
});

router.get('/users/:email', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  User.findOne({
    email: req.params.email
  })
    .then(user => {
      res.status(200).json({
        "version": "v2",
        "content": {
          "actions": [{
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

router.post('/messages', ensureAuthenticated, async (req, res) => {
  const newMessage = {
    title: req.body.title,
    body: req.body.body,
    userFrom: req.user.id,
    userTo: req.body.userTo
  }
  new Message(newMessage).save().then(message => {
    res.status(200).json(message)
  })
});

router.get('/messages', ensureAuthenticated, async (req, res) => {
  const messages = await Message
    .find({
      $or: [{
        userTo: {
          $eq: req.user.id
        }
      }, {
        userFrom: {
          $eq: req.user.id
        }
      }, {
        replys: {
          userTo: req.user.id
        }
      }, {
        replys: {
          userFrom: req.user.id
        }
      }]
    })
    .populate('userFrom').populate('userTo')
    .sort({
      newMsgDate: 'desc'
    });
  res.status(200).render('index/message', {
    messages,
  });
});


router.get('/messages/:id', ensureAuthenticated, async (req, res) => {
  const message = await Message.findById(req.params.id).populate('userFrom').populate('userTo');
  if (message) {
    res.status(200).json(message)
  } else {
    res.status(404).render('index/404');
  }
});

//read message
router.put('/messages/:id', ensureAuthenticated, async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id)
    .populate('userFrom').populate('userTo')
    .populate('replys.userFrom').populate('replys.userTo');
  console.log(message);
  if (message.newMessage) {
    if (req.user.id == message.userTo) {
      message.read = true,
        message.newMessage = false
    }
  };
  if (message.newReply) {
    console.log(req.user.id);
    console.log(message.replys.userTo);

    if (req.user.id == message.replys.userTo) {
      message.read = true,
        message.newReply = false
    }
  }
  message.save()
    .then(message => {
      res.status(200).json(message);
    })
});

//reply message
router.post('/message-reply/:id', ensureAuthenticated, async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id);
  message.newReply = true;
  message.newMsgDate = moment();
  const newReply = {
    replyTitle: 'Re: ' + message.title,
    replyBody: req.body.replyBody,
    userFrom: req.user.id,
    userTo: message.userFrom
  }
  message.replys.unshift(newReply);
  message.save()
    .then(message => {
      res.status(200).json(message);
    })
});

module.exports = router;