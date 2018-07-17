const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CvSchema = new Schema({
  fullName: { type: String },
  userId: { type: String },// FB userID coming form Manychat
  photo: { type: String },
  phone: { type: String },
  email: { type: String },
  location: { type: String },
  currentRole: { type: String },
  desiredRole: { type: String },
  description: { type: String },
  videoResumeUri: { type: String },
  specialisms: { type: String },
  education: { type: String },
  yearsOfExperiance: { type: Number },
  languages: { type: String },
  skills: { type: String },
  hoppies: { type: String },
  status: { type: String, default: 'public' },
  date: { type: Date, default: Date.now }
})

//create collection and add schema
mongoose.model('cvs', CvSchema);