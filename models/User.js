const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  facebook: String,
  tokens: Array,
  name: { type: String },
  picture: { type: String }
})

//create collection and add schema
mongoose.model('users', UserSchema,'users');