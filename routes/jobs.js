const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Resume = mongoose.model('resumes');
const Company = mongoose.model('companies');
const Job = mongoose.model('jobs');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');


router.post('/', ensureAuthenticated, async (req, res) => {
  if (req.user.role == 'employer') {
    const jobs = await Job.find();
    const count = jobs.length;
    const company = await Company.findOne({ user: req.user.id });
    var str_title = req.body.title;
    var str_company = company.name;
    var str_address = req.body.address;

    str1 = str_title.replace(/\s+/g, '-').toLowerCase();
    str2 = str_company.replace(/\s+/g, '-').toLowerCase();
    str3 = str_address.replace(/\s+/g, '-').toLowerCase();
    const handle = str1 + "-" + str2 + "-" + str3 + "-" + 'talent-liken-job-vacancy-' + count;

    const newJob = {
      handle: handle,
      title: req.body.title,
      description: req.body.description,
      email: req.body.email,
      specialisms: req.body.specialisms,
      salary: req.body.salary,
      currency: req.body.currency,
      level: req.body.level,
      experience: req.body.experience,
      qualification: req.body.qualification,
      deadline: req.body.deadline,
      address: req.body.address,
      user: req.user.id,
      company: company._id
    }
    new Job(newJob)
      .save()
      .then(job => {
        res.redirect(`/jobs/view/${job.handle}`)
      });
  } else {
    req.flash('error_msg', 'You dont have permission to post jobs');
    res.redirect('/dashboard')

  }

});

router.get('/', (req, res) => {
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Job.find({ title: regex }, function (err, jobs) {
      if(err){
        console.log(err);
      }else{
        if(jobs.length < 1){
          noMatch = "No jobs match that query, please try again.";
        }
        res.render('jobs/index',{jobs:jobs , noMatch:noMatch})
      }
    });
  } else {
    Job.find()
      .populate('company')
      .sort({ date: 'desc' })
      .then(jobs => {
        count = jobs.length;
        res.render('jobs/index', {
          jobs: jobs,
          count: count,
          noMatch: noMatch
        })
      });
  }

});

router.get('/my-maching-jobs', ensureAuthenticated, async (req, res) => {

  const resume = await Resume.findOne({ 'user': req.user.id }).populate('user');
  const jobs = await Job.find({ specialisms: resume.specialisms }).populate('company');

  res.render('jobs/index', {
    jobs: jobs
  });
});

router.get('/view/:handle', (req, res) => {
  Job.findOne({ handle: req.params.handle })
    .populate('user')
    .then(job => {
      res.render('jobs/view')
    });
});

router.get('/add', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role == 'employer') {
      res.render('jobs/add')
    } else {
      req.flash('error_msg', 'You dont have permission to post jobs');
      res.redirect('/dashboard')
    }
  } else {
    req.flash('error_msg', 'You must login first');
    res.redirect('/auth/employers/login');
  }
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;