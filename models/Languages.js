const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const LanguagesSchema = new Schema({

  name: {
    type: String
  },
  level: {
    type: String
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
mongoose.model('languages', LanguagesSchema, 'languages');