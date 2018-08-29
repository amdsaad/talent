const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Shema
const EducationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  resume:{
    type: Schema.Types.ObjectId,
    ref: 'resumes'
  },
  school: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  fieldofstudy: {
    type: String,
    required: true
  },
  location:{
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
  }
});

// Create collection and add schema
mongoose.model('education', EducationSchema, 'education');