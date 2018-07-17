const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CvSchema = new Schema({
  fullName: { type: String, required: true },
  userId: { type: String },// FB userID coming form Manychat
  photo: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  currentRole: { type: String, required: true },
  desiredRole: { type: String, required: true },
  description: { type: String, required: true },
  videoResumeUri: { type: String },
  specialisms: { type: String },
  education: { type: String },
  yearsOfExperiance: { type: Number },
/*   experiances: [{
    title: { type: String },
    companyName: { type: String },
    datePeriod: { from: { type: Date }, to: { type: Date } },
  }], */
  languages: { type: String },
  skills: { type: String },
  hoppies: { type: String },
  status: { type: String, default: 'public' },
  date: { type: Date, default: Date.now }
  //allowContact: { type: Boolean, default: true },
})

//create collection and add schema
mongoose.model('cvs', CvSchema, 'cvs');