const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  emailAddress: String,
  phoneNumber: String,
  password: String,
  imageUrl: String
});

module.exports = mongoose.model('User', schema);