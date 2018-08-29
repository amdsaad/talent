const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Shema
const ExperianceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  resume:{
    type: Schema.Types.ObjectId,
    ref: 'resumes'
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date
  },
  current: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('experiance', ExperianceSchema, 'experiance');