const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const JobSchema = new Schema({

  title: {
    type: String,
    lowercase:true,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  specialisms: {
    type: String,
    required: true
  },
  salary: {
    type: String,
  },
  currency: {
    type: String,
  },
  level: {
    type: String,
  },
  experience: {
    type: String,
  },
  qualification: {
    type: String,
  },
  deadline: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'companies'
  },
  date:{
    type: Date,
    default: Date.now
  }
})

//create collection and add schema
exports.JobSchema = JobSchema;
mongoose.model('jobs', JobSchema, 'jobs');