var jwt = require('jsonwebtoken');
var Database = require('../helpers/database');

async function authorize(req, res, next) {
  try {
    var authorizationHeader = req.headers['authorization'];
    var requestToken = authorizationHeader && authorizationHeader.split(' ')[1];
    var decodedToken = jwt.verify(requestToken, process.env.TOKEN_SECRET, { issuer: 'iWagerGames' });
    if (decodedToken) {
      req.user = await Database.User
        .findOne({ _id: decodedToken.sub })
        .exec()
        .catch((err) => { console.error(err.message); return res.sendStatus(500); });
      if (req.user) { return next(); }
      res.sendStatus(403);
    }
    res.sendStatus(401);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
}

module.exports = authorize;