const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  googleID: String,
  facebook: String,
  tokens: Array,
  name: { type: String },
  picture: { type: String },
  password: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  secretCode:String,
  active:{
    type:Boolean,
    default:false
  },
  role: {
    type: String,
    default: 'candidate'
  },
  admin: {
    type: Boolean,
    default: false
  },
  activities: [{
    activityName: {
      type: String
    },
    activityBody: {
      type: String,
    },
    url: {
      type: String,
    },
    activityDate: {
      type: Date,
      default: Date.now
    },
  }],
});
//create collection and add schema
exports.UserSchema = UserSchema;
mongoose.model('users', UserSchema, 'users');
