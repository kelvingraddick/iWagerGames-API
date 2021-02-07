const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  description: String,
  logoImageUrl: String,
  bannerImageUrl: String,
  platforms: [String],
  modes: [{ _id: String, name: String, description: String }],
  rules: [{ _id: String, name: String, description: String }]
});

module.exports = mongoose.model('Game', schema);