const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const MessageSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  read :{
    type: Boolean,
    default: false
  },
  body: {
    type: String,
    required: true
  },
  newMessage: {
    type: Boolean,
    default: true
  },
  newReply: {
    type: Boolean,
    default: false
  },
  replys: [{
    replyTitle: {
      type: String,
      required: true
    },
    replyBody: {
      type: String,
      required: true
    },
    replyDate: {
      type: Date,
      default: Date.now
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    userTo: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
  }],
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  newMsgDate: {
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('messages', MessageSchema, 'messages');