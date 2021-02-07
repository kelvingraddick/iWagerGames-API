var express = require('express');
var router = express.Router();
var Database = require('../helpers/database');

router.get('/:id', async function(req, res, next) {
  var response = { isSuccess: false };

  response.game = await Database.Game.findById(req.params.id).exec()
    .catch((error) => { response.errorMessage = error.message; });
  response.isSuccess = response.game != null;
  
  res.json(response);
});

module.exports = router;

