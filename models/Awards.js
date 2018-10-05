const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const AwardsSchema = new Schema({
  name: {
    type: String,
    required:true
  },
  awarder: {
    type: String,
    required:true
  },
  summary: {
    type: String,
    required:true
  },
  awardedOn: {
    type: String,
    required:true
  },
  resume: {
    type: Schema.Types.ObjectId,
    ref: 'resumes'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('awards', AwardsSchema, 'awards');