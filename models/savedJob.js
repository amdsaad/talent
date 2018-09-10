const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const savedJobSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'jobs'
  },
  jobHandle: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('savedJobs', savedJobSchema, 'savedJobs');