const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Resume = mongoose.model('resumes');
const Posts = mongoose.model('posts');
const User = mongoose.model('users');
const Experiance = mongoose.model('experiance');
const Education = mongoose.model('education');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Resumes Index
router.get('/', (req, res) => {
  Resume.find({ status: 'public' , published: 'true'})
    .populate('user')
    .sort({ date: 'desc' })
    .then(resumes => {
      res.render('resumes/index', {
        resumes: resumes
      });
    });
});

// Add Resume Form
router.get('/add', ensureAuthenticated, (req, res) => {
  Resume.findOne({ user: req.user.id }).then(resume => {
    if (resume) {
      req.flash('error_msg', 'You Alreay have CV in file');
      res.redirect(`/candidate-resume/manage-my-resume/${resume.id}`);

    } else {
      res.render('resumes/add');
    }
  });
});
// Process Add Resume
router.post('/', ensureAuthenticated, (req, res) => {
  Resume.findOne({ user: req.user.id }).then(resume => {
    if (resume) {
      req.flash('error_msg', 'You Alreay have CV in file');
      res.redirect('/dashboard')
    } else {
      // Get fields
      var str = req.user.name;
      str = str.replace(/\s+/g, '-').toLowerCase();
      const handle = str + "-" + req.user.id;
      const profileFields = {};
      profileFields.user = req.user.id;
      profileFields.fullName = req.body.fullName;
      profileFields.email = req.body.email;
      profileFields.picture = req.body.picture;
      profileFields.handle = handle;
      if (req.body.jobTitle) profileFields.jobTitle = req.body.jobTitle;
      if (req.body.specialisms) profileFields.specialisms = req.body.specialisms;
      if (req.body.location) profileFields.location = req.body.location;
      if (req.body.contactNumber) profileFields.contactNumber = req.body.contactNumber;
      if (req.body.bio) profileFields.bio = req.body.bio;
      if (req.body.status) profileFields.status = req.body.status;
      if (req.body.style) profileFields.style = req.body.style;
      if (typeof req.body.languages !== 'undefined') {
        profileFields.languages = req.body.languages.join().split(',');
      }
      new Resume(profileFields)
        .save()
        .then(resume => {
          res.redirect(`/candidate-resume/manage-my-resume/${resume.id}`);
        });
    }
  })
});

//show single Resume Handle SEO
router.get('/:handle', async (req, res) => {
  const resumes = await Resume.findOne({ handle: req.params.handle }).populate('user');
  const posts = await Posts.find({ user: resumes.user._id });
  const experiance = await Experiance.find({ user: resumes.user._id });
  const education = await Education.find({ user: resumes.user._id });

  if (resumes.style == 'default') {
    resumeDefualt = true
  } else {
    resumeDefualt = false
  }

  res.render('resumes/show', {
    resumes: resumes,
    posts: posts,
    experiance: experiance,
    education: education,
    resumeDefualt: resumeDefualt
  });
});


// Edit Resume Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Resume
    .findOne({ _id: req.params.id })
    .then(resume => {
      if (resume.user != req.user.id) {
        res.redirect('/resumes');
      } else {
        res.render('resumes/edit', {
          resume: resume
        });
      }
    });
});

// Edit Resume Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Resume.findByIdAndUpdate(req.params.id, req.body.resume, { new: true }, (err, resume) => {
    if (err) {
      console.log(err);
    } else {
      res.json(resume);
    }
  });
});

//Manage resume - inlcludes experience and education
router.get('/manage-my-resume/:id', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id }).populate('user');
  const experiance = await Experiance.find({ 'user': req.user.id }).sort({ date: 'desc' });
  const education = await Education.find({ 'user': req.user.id }).sort({ date: 'desc' });
  if (resume.style == 'default') {
    resumeDefualt = true
  } else {
    resumeDefualt = false
  };

  if (resume.style == 'oneCol') {
    resumeOneCol = true
  } else {
    resumeOneCol = false
  };

  if (resume.published == 'true') {
    published = true
  } else {
    published = false
  };

  if (resume.user._id == req.user.id) {
    res.render('resumes/manage-my-resume', {
      resume: resume,
      experiance: experiance,
      education: education,
      resumeDefualt: resumeDefualt,
      resumeOneCol: resumeOneCol,
      published:published
    });
  } else {
    req.flash('error_msg', 'You Do not have permission to do this');
    res.redirect('/dashboard');
  }
});


//add experience 
router.post('/experience', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({ 'user': req.user.id });
  console.log(resume._id);

  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    user: req.user.id,
    resume: resume._id,
    description: req.body.description
  };
  new Experiance(newExp)
    .save()
    .then(experiance => {
      res.json(experiance)
/*       res.redirect(`/candidate-resume/manage-my-resume/${resume._id}`);
 */    });

});

// edit experience form
router.get('/experience/edit/:id', ensureAuthenticated, (req, res) => {
  Experiance.findOne({ _id: req.params.id })
    .populate('resume')
    .sort({ date: 'desc' })
    .then(experiance => {
      res.render('resumes/edit-experiance', {
        experiance,
      });
    });
});

// process expe form
router.put('/experience/:id', ensureAuthenticated, (req, res) => {
  Experiance.findByIdAndUpdate(req.params.id, req.body.exper, { new: true }, (err, exper) => {
    if (err) {
      console.log(err);
    } else {
      res.json(exper);
    }
  });
});

router.delete('/experience/:id', ensureAuthenticated, (req, res) => {
  Experiance.findByIdAndRemove(req.params.id, (err, exper) => {
    if (err) {
      console.log(err);
    } else {
      res.json(exper);
    }
  });
});

router.post('/education', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({ 'user': req.user.id });
  const newEdu = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    user: req.user.id,
    resume: resume._id,
    description: req.body.description
  };
  new Education(newEdu)
    .save()
    .then(education => {
      res.json(education);
/*       res.redirect(`/candidate-resume/manage-my-resume/${resume._id}`);
 */    });

});

router.get('/education', ensureAuthenticated, async (req, res) => {
  const education = await Education.find({ 'user': req.user.id });
  res.json(education);
});

router.get('/education/edit/:id', ensureAuthenticated, (req, res) => {
  Education.findOne({ _id: req.params.id })
    .populate('resume')
    .sort({ date: 'desc' })
    .then(education => {
      res.render('resumes/edit-education', {
        education,
      });
    });
});

router.put('/education/:id', ensureAuthenticated, (req, res) => {
  Education.findByIdAndUpdate(req.params.id, req.body.education, { new: true }, (err, educ) => {
    if (err) {
      console.log(err);
    } else {
      res.json(educ);
    }
  });
});

router.delete('/education/:id', ensureAuthenticated, (req, res) => {
  Education.findByIdAndRemove(req.params.id, (err, educ) => {
    if (err) {
      console.log(err);
    } else {
      res.json(educ);
    }
  });
});


module.exports = router;