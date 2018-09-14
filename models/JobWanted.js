const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const JobWantedSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  currentJob: {
    type: String,
    required: true
  },
  desiredJob: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    unique:true,
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
  company: {
    type: Schema.Types.ObjectId,
    ref: 'companies'
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('jobWanted', JobWantedSchema, 'jobWanted');