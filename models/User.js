const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  googleID:String,
  facebook: String,
  tokens: Array,
  name: { type: String },
  picture: { type: String },
  password:{
    type: String,
   
  },
  role:{
    type:String,
    default:'candidate'
  },

})

//create collection and add schema
exports.UserSchema = UserSchema;
mongoose.model('users', UserSchema,'users');