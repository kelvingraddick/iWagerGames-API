var express = require('express');
var router = express.Router();
var Database = require('../helpers/database');

router.get('/', async function(req, res, next) {
  var response = { isSuccess: false };

  response.games = await Database.Game.find().exec()
    .catch((error) => { response.errorMessage = error.message; });
  response.isSuccess = response.games != null;
  
  res.json(response);
});

module.exports = router;