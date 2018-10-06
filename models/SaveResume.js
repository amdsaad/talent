const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const saveResumeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  resumeId: {
    type: Schema.Types.ObjectId,
    ref: 'resumes'
  },
  resumeHandle: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('saveResume', saveResumeSchema, 'saveResume');