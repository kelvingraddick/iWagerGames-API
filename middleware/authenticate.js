var jwt = require('jsonwebtoken');
var Database = require('../helpers/database');

async function authenticate(req, res, next) {
  try {
    res.user = await Database.User
      .findOne({ $or: [{ username: req.body.username }, { emailAddress: req.body.emailAddress }, { phoneNumber: req.body.phoneNumber }], password: req.body.password })
      .exec()
      .catch((err) => { console.error(err.message); return res.sendStatus(500); });
    if (res.user) {
      res.token = jwt.sign({ }, process.env.TOKEN_SECRET, { subject: res.user._id.toString(), issuer: 'iWagerGames', expiresIn: '1d' });
      return next();
    }
    res.sendStatus(401);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
}

module.exports = authenticate;