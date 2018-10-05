const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  'dest': 'uploads/'
});
const fs = require('fs');
const mongoose = require('mongoose');
const Resume = mongoose.model('resumes');
const Posts = mongoose.model('posts');
const User = mongoose.model('users');
const Experiance = mongoose.model('experiance');
const Education = mongoose.model('education');
const Message = mongoose.model('messages');
const Skill = mongoose.model('skills');
const Language = mongoose.model('languages');
const Award = mongoose.model('awards');
const {
  ensureAuthenticated,
  ensureGuest
} = require('../helpers/auth');
const keys = require('../config/keys');

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dgghoxlug',
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret
});

// Add Resume Form
router.get('/add', ensureAuthenticated, (req, res) => {
  Resume.findOne({
    user: req.user.id
  }).then(resume => {
    if (resume) {
      req.flash('error_msg', 'You Alreay have CV in file');
      res.redirect(`/candidate-resume/manage-my-resume/${resume.id}`);

    } else {
      res.render('resumes/add');
    }
  });
});
// Process Add Resume
router.post('/', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({
    user: req.user.id
  });
  if (resume) {
    req.flash('error_msg', 'You Alreay have CV in file');
    res.redirect('/dashboard')
  } else {
    cloudinary.v2.uploader.upload("https://res.cloudinary.com/dgghoxlug/image/upload/v1535918171/lem0ardcpdmvzpd6or8v.png", (error, result) => {
      console.log(result, error);
      // Get fields
      var str = req.user.name;
      str = str.replace(/\s+/g, '-').toLowerCase();
      const handle = str + "-" + req.user.id;
      const profileFields = {};
      profileFields.pictureUrl = result.secure_url;
      profileFields.picturePublic_id = result.public_id;
      profileFields.user = req.user.id;
      profileFields.fullName = req.user.name;
      profileFields.email = req.user.email;
      profileFields.handle = handle;
      profileFields.specialisms = req.body.specialisms;
      if (req.body.jobTitle) profileFields.jobTitle = req.body.jobTitle;
      if (req.body.location) profileFields.location = req.body.location;
      if (req.body.contactNumber) profileFields.contactNumber = req.body.contactNumber;
      if (req.body.bio) profileFields.bio = req.body.bio;
      if (req.body.status) profileFields.status = req.body.status;
      if (req.body.style) profileFields.style = req.body.style;

      console.log('req body ', profileFields);

      new Resume(profileFields)
        .save()
        .then(resume => {
          res.redirect(`/candidate-resume/manage-my-resume/${resume.id}`);
        });
    });
  }
});

// Resumes Index
router.get('/', async (req, res) => {
  const resumes = await Resume.find({
      status: 'public',
      published: 'true'
    })
    .populate('user')
    .populate('skills')
    .populate('languages')
    .sort({
      date: 'desc'
    });
  res.render('resumes/index', {
    resumes,
  })

});

//show single Resume Handle SEO
router.get('/:handle', async (req, res) => {
  const back = '/candidate-resume';
  const resumes = await Resume.findOne({
    handle: req.params.handle
  }).populate('user');
  if (resumes) {
    const posts = await Posts.find({
      user: resumes.user._id
    });
    const experiance = await Experiance.find({
      user: resumes.user._id
    });
    const education = await Education.find({
      user: resumes.user._id
    });
    const skill = await Skill.find({
      user: resumes.user._id
    });
    const language = await Language.find({
      user: resumes.user._id
    });
    const award = await Award.find({
      user: resumes.user._id
    });

    if (resumes.style == 'default') {
      resumeDefualt = true
    } else {
      resumeDefualt = false
    }
    if (resumes.style == 'simple') {
      resumeSimple = true
    } else {
      resumeSimple = false
    }


    res.render('resumes/show', {
      resumes: resumes,
      posts: posts,
      experiance: experiance,
      education: education,
      skill,
      language,
      award,
      resumeDefualt: resumeDefualt,
      resumeSimple
    });
  } else {
    res.status(404).render('index/404', {
      back,
      pageName: "Talent's Resume's"
    })
  }
});

// Edit Resume Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Resume
    .findOne({
      _id: req.params.id
    })
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
router.put('/:id', ensureAuthenticated, upload.single('picture'), (req, res) => {
  if (req.file) {
    Resume.findById(req.params.id, async (err, resume) => {
      if (err) {
        console.log(err);
      } else {
        try {
          await cloudinary.v2.uploader.destroy(resume.picturePublic_id);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          resume.pictureUrl = result.secure_url;
          resume.picturePublic_id = result.public_id;
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.log(err);
        }
        resume.save();
        req.flash('success_msg', 'Successfully updated');
        res.json(resume)
      }
    });
  } else {
    Resume.findByIdAndUpdate(req.params.id, req.body.resume, {
      new: true
    }, (err, resume) => {
      if (err) {
        console.log(err);
      } else {
        res.json(resume);
      }
    });
  }

});

//Manage resume - inlcludes experience and education
router.get('/manage-my-resume/:id', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({    _id: req.params.id  }).populate('user');
  const experiance = await Experiance.find({    'user': req.user.id  }).sort({    date: 'desc'  });
  const education = await Education.find({    'user': req.user.id  }).sort({    date: 'desc'  });
  const skill = await Skill.find({    'user': req.user.id  }).sort({    date: 'desc'  });
  const language = await Language.find({    'user': req.user.id  }).sort({    date: 'desc'  });
  const award = await Award.find({    'user': req.user.id  }).sort({    date: 'desc'  });
  if (resume) {
    if (resume.style == 'default') {
      resumeDefualt = true
    } else {
      resumeDefualt = false
    };
    if (resume.style == 'simple') {
      resumeSimple = true
    } else {
      resumeSimple = false
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
        resumeDefualt,
        resumeSimple,
        skill,
        language,
        award,
        published: published
      });
    } else {
      req.flash('error_msg', 'You Do not have permission to do this');
      res.redirect('/dashboard');
    }
  };
});

//add experience 
router.post('/experience', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({
    'user': req.user.id
  });
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
    });
});

// edit experience form
router.get('/experience/edit/:id', ensureAuthenticated, (req, res) => {
  Experiance.findOne({
      _id: req.params.id
    })
    .populate('resume')
    .sort({
      date: 'desc'
    })
    .then(experiance => {
      res.render('resumes/edit-experiance', {
        experiance,
      });
    });
});

// process expe form
router.put('/experience/:id', ensureAuthenticated, (req, res) => {
  Experiance.findByIdAndUpdate(req.params.id, req.body.exper, {
    new: true
  }, (err, exper) => {
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
  const resume = await Resume.findOne({
    'user': req.user.id
  });
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
    });
});

router.get('/education', ensureAuthenticated, async (req, res) => {
  const education = await Education.find({
    'user': req.user.id
  });
  res.json(education);
});

router.get('/education/edit/:id', ensureAuthenticated, (req, res) => {
  Education.findOne({
      _id: req.params.id
    })
    .populate('resume')
    .sort({
      date: 'desc'
    })
    .then(education => {
      res.render('resumes/edit-education', {
        education,
      });
    });
});

router.put('/education/:id', ensureAuthenticated, (req, res) => {
  Education.findByIdAndUpdate(req.params.id, req.body.education, {
    new: true
  }, (err, educ) => {
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

router.post('/skills', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({
    'user': req.user.id
  });
  const newSkill = {
    name: req.body.name,
    level: req.body.level,
    resume: resume._id,
    user: req.user.id
  };
  new Skill(newSkill)
    .save()
    .then(skill => {
      resume.skills.unshift(skill);
      resume.save();
      res.json(skill);
    });
});

router.delete('/skills/:id', ensureAuthenticated, async (req, res) => {
  Skill.findByIdAndRemove(req.params.id, (err, skill) => {
    if (err) {
      console.log(err);
    } else {
      Resume.findOneAndUpdate({
        'user': req.user.id
      }, {
        $pull: {
          "skills": {
            $in: [skill._id]
          }
        }
      }, {
        new: true
      }, (err, resume) => {
        if (err) {
          console.log(err)
        }
      })
      res.json(skill);
    }
  });
});

router.post('/languages', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({
    'user': req.user.id
  });
  const newLanguage = {
    name: req.body.name,
    level: req.body.level,
    resume: resume._id,
    user: req.user.id
  };
  new Language(newLanguage)
    .save()
    .then(language => {
      resume.languages.unshift(language);
      resume.save();
      res.json(language);
    });
});

router.delete('/languages/:id', ensureAuthenticated, (req, res) => {
  Language.findByIdAndRemove(req.params.id, (err, language) => {
    if (err) {
      console.log(err);
    } else {
      Resume.findOneAndUpdate({
        'user': req.user.id
      }, {
        $pull: {
          "languages": {
            $in: [language._id]
          }
        }
      }, {
        new: true
      }, (err, resume) => {
        if (err) {
          console.log(err)
        }
      })
      res.json(language);
    }
  });
});

router.post('/awards', ensureAuthenticated, async (req, res) => {
  const resume = await Resume.findOne({
    'user': req.user.id
  });
  const newAwad = {
    name: req.body.name,
    awarder: req.body.awarder,
    summary: req.body.summary,
    awardedOn: req.body.awardedOn,
    resume: resume._id,
    user: req.user.id
  };
  new Award(newAwad)
    .save()
    .then(awards => {
      res.json(awards);
    });
});

router.delete('/awards/:id', ensureAuthenticated, (req, res) => {
  Award.findByIdAndRemove(req.params.id, (err, award) => {
    if (err) {
      console.log(err);
    } else {
      res.json(award);
    }
  });
});

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

module.exports = router;