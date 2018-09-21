const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const ApplicationsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  resume: {
    type: Schema.Types.ObjectId,
    ref: 'resumes'
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'jobs'
  },
  jobTitle: {
    type: String
  },
  jobHandle: {
    type: String
  },
  coveringLetter: {
    type: String
  },
  applied: {
    type: Boolean,
  },
  status: {
    type: String,
    default:'sent'
  },
  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentDate: {
      type: Date,
      default: Date.now
    },
    commentUser: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('applications', ApplicationsSchema, 'applications');