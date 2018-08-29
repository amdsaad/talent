const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CompanySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  specialisms: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true,
    default:'http://2.bp.blogspot.com/-Y2XrnrXJmXs/Uf5Y_bfr4jI/AAAAAAAAALk/ydouC9lEmDE/s1600/Logogap+Logobb.jpg'
   },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date:{
    type: Date,
    default: Date.now
  }
})

//create collection and add schema
exports.CompanySchema = CompanySchema;
mongoose.model('companies', CompanySchema, 'companies');