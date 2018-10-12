const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Resume = mongoose.model('resumes');
const Application = mongoose.model('applications');
const SavedJob = mongoose.model('savedJobs');
const Company = mongoose.model('companies');
const Job = mongoose.model('jobs');
const moment = require('moment');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/add', async (req, res) => {
  const jobs = await Job.find({});
  const count = jobs.length;
  if (req.isAuthenticated()) {
    if (req.user.role == 'employer') {
      res.render('jobs/add', {
        count: count
      })
    } else {
      req.flash('error_msg', 'You dont have permission to post jobs');
      res.redirect('/dashboard')
    }
  } else {
    req.flash('error_msg', 'You must login as employer first to add jobs');
    res.redirect('/auth/employers/login');
  }
});
router.get('/amd', (req, res) => {
  var date = moment();
  var expDate = moment().add(30, 'day');
  var isExpired = moment(date).isAfter(expDate);

  res.send(isExpired)

});
router.post('/', ensureAuthenticated, async (req, res) => {
  if (req.user.role == 'employer') {
    const jobs = await Job.find();
    const count = jobs.length;
    const company = await Company.findOne({ user: req.user.id });
    var str_title = req.body.title;
    var str_company = company.name;
    var str_country = req.body.country;
    var str_city = req.body.city;
    var date = moment();
    var expDate = moment().add(30, 'day');

    str1 = str_title.replace(/\s+/g, '-').toLowerCase();
    str2 = str_company.replace(/\s+/g, '-').toLowerCase();
    str3 = str_country.replace(/\s+/g, '-').toLowerCase();
    str4 = str_city.replace(/\s+/g, '-').toLowerCase();
    const handle = str1 + "-" + str2 + "-" + str3 + "-" + str4 + "-" +'talent-liken-job-vacancy-' + count;
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
      benefits: req.body.benefits,
      deadline: req.body.deadline,
      country: req.body.country,
      city: req.body.city,
      user: req.user.id,
      company: company._id,
      date: date,
      expiryDate: expDate
    }
    new Job(newJob)
      .save()
      .then(job => {
        res.redirect(`/jobs/${job.handle}`)
      });
  } else {
    req.flash('error_msg', 'You dont have permission to post jobs');
    res.redirect('/dashboard')

  }

});

router.get('/', async (req, res) => {
  var noMatch = null;
  if (req.query.search) {
    var today = new Date();
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Job.find({ 'expiryDate': { $gte: today }, 'title': regex }, function (err, jobs) {
      if (err) {
        console.log(err);
      } else {
        if (jobs.length < 1) {
          noMatch = "No jobs match that query, please try again.";
        }
        var count = jobs.length;
        res.render('jobs/index', { jobs: jobs, noMatch: noMatch,count })
      }
    }).populate('company');
  } else if (req.query.location) {
    var today = new Date();
    const regex = new RegExp(escapeRegex(req.query.location), 'gi');
    Job.find({ 'expiryDate': { $gte: today },  $or:[{'country': regex},{'city': regex}]}, function (err, jobs) {
      if (err) {
        console.log(err);
      } else {
        if (jobs.length < 1) {
          noMatch = "No jobs match that query, please try again.";
        }
        var count = jobs.length;
        res.render('jobs/index', { jobs: jobs, noMatch: noMatch ,count})
      }
    }).populate('company');
  } else {
    var today = new Date();
    Job.find({ expiryDate: { $gte: today } })
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

router.get('/:handle', async (req, res) => {
  var today = new Date();
  const job = await Job.findOne({ handle: req.params.handle, expiryDate: { $gte: today } }).populate('company').populate('user');
  let applied = false;

  if (job) {
    companyJobs = job.company._id;
    jobs = await Job.find({ company: companyJobs });
    applications = await Application.find({ 'jobHandle': req.params.handle }).populate('user');
    applicationsCount = applications.length;
    if (req.user) {
      const resume = await Resume.findOne({ user: req.user.id });
      const saved = await SavedJob.findOne({ 'jobHandle': req.params.handle, 'user': req.user.id })
      const userApplication = await Application.findOne({ 'jobHandle': req.params.handle, 'user': req.user.id });
      if (userApplication) {
        res.render('jobs/view', {
          job: job,
          applicationsCount: applicationsCount,
          jobs: jobs,
          resume: resume,
          applied: true,
          saved: saved,
          userApplication: userApplication
        });
      } else {
        res.render('jobs/view', {
          job: job,
          applicationsCount: applicationsCount,
          jobs: jobs,
          resume: resume,
          saved: saved,
          applied: false
        });
      }
    } else {
      res.render('jobs/view', {
        job: job,
        jobs: jobs,
        applicationsCount: applicationsCount,
        applied: applied
      });
    }
  } else {
    res.status(404).render('index/404');
  }
});

router.post('/:handle/application', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({ user: req.user.id });
  const job = await Job.findOne({ handle: req.params.handle });
  if (!resume) {
    req.flash('error_msg', 'You do not have resume in file to apply for this job');
    res.redirect(`/jobs/${job.handle}`)
  } else {
    const newApplication = {
      user: req.user.id,
      resume: resume._id,
      job: job._id,
      jobTitle: job.title,
      jobHandle: job.handle,
      applied: true,
      status: req.body.status,
      employerComment: req.body.employerComment,
      coveringLetter: req.body.coveringLetter,
    }
    new Application(newApplication)
      .save()
      .then(applicaion => {
        res.json(applicaion)
      });
  }
});

router.post('/application/comment/:id', ensureAuthenticated, async (req, res) => {
  const application = await Application.findOne({ _id: req.params.id })
    .populate('activities.activityUser');
  const newComment = {
    commentBody: req.body.commentBody,
    commentUser: req.user.id,
    activityName: 'Comment Added',
    activityBody: req.body.commentBody,
  }
  const newActivity = {
    activityName: 'Comment Added',
    activityBody: req.body.commentBody,
    activityUser: req.user.id,
    activityUserName: req.user.name,
  }

  application.comments.unshift(newComment);
  application.activities.unshift(newActivity);
  application.save()
  res.status(200).json(application);
});

// update application by employer
router.put('/application/:id', async (req, res) => {
  const application = await Application.findById(req.params.id);
  application.status = req.body.status;
  const newActivity = {
    activityName: 'Status update',
    activityBody: req.body.status,
    activityUser: req.user.id,
    activityUserName: req.user.name,
  }
  application.activities.unshift(newActivity);
  application.save()
  res.status(200).json(application);
});

router.get('/:handle/applications', ensureAuthenticated, async (req, res) => {
  let shortlisted = false;
  const job = await Job.findOne({ handle: req.params.handle });
  const applications = await Application.find({ jobHandle: req.params.handle, status: 'sent' })
    .populate('resume').populate('activities.activityUser');
  if (req.user.role != 'employer') {
    req.flash('error_msg', 'You dont have permission to view this applications');
    res.redirect(`/jobs/${req.params.handle}`);
  } else {
    res.status(200).render('jobs/applications', {
      applications,
      applicationHeading: "applications",
      job,
      shortlisted,
    });
  }
});
router.get('/:handle/applications/shortlisted', ensureAuthenticated, async (req, res) => {
  let shortlisted = true;
  const job = await Job.findOne({ handle: req.params.handle });
  const applications = await Application.find({ jobHandle: req.params.handle, status: 'shortlisted' })
    .populate('resume').populate('activities.activityUser');
  if (req.user.role != 'employer') {
    req.flash('error_msg', 'You dont have permission to view this applications');
    res.redirect(`/jobs/${req.params.handle}`);
  } else {
    res.status(200).render('jobs/applications', {
      applications,
      applicationHeading: "shortlisted",
      job,
      shortlisted,
    });
  }
});

router.post('/:handle/saved-jobs', async (req, res) => {
  const job = await Job.findOne({ handle: req.params.handle });
  const jobId = job._id;
  const jobHandle = job.handle;
  if (!req.user) {
    res.json({ msg: 'you must login to save jobs', jobHandle: jobHandle })
  } else {
    const newSavedJob = {
      user: req.user.id,
      jobId: jobId,
      jobHandle: jobHandle,
    }
    new SavedJob(newSavedJob)
      .save()
      .then(savedJob => {
        res.json(savedJob)
      });
  }
});

router.delete('/:handle/saved-jobs/:id', ensureAuthenticated, (req, res) => {
  SavedJob.findByIdAndRemove(req.params.id, (err, saved) => {
    if (err) {
      console.log(err);
    } else {
      res.json(saved);
    }
  });
});


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;