const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Shema
const ResumeSchema = new Schema({
  handle: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  published: {
    type: String,
    default: 'false'
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  pictureUrl:  { 
    type: String,
  },
  picturePublic_id:{
    type:String
  },
  jobTitle: {
    type: String,
    default: 'Job Title',
    required: true
  },
  specialisms: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Location',
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  style: {
    type: String,
    default: 'default',
    required: true
  },
  languages: {
    type: [String]
  },
  bio: {
    type: String,
    default: "Lorem Ipsum is simply nturies, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  contactNumber: {
    type: String,
    default: '+1-202-555-0174',
  },
  experience: {
    type: Schema.Types.ObjectId,
    ref: 'experiance'
  },
  education: {
    type: Schema.Types.ObjectId,
    ref: 'education'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('resumes', ResumeSchema, 'resumes');