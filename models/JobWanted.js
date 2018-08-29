const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const JobWantedSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  resume: {
    type: Schema.Types.ObjectId,
    ref: 'resumes'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('jobWanted', JobWantedSchema, 'jobWanted');