const mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.DATABASE_HOST + '/' + process.env.DATABASE_NAME, {useNewUrlParser: true});

const Database = mongoose.connection;
Database.on('error', console.error.bind(console, 'connection error:'));
Database.once('open', function() {
  Database.User = require('../models/user');
  Database.Game = require('../models/game');
});

module.exports = Database;