var express = require('express');
var router = express.Router();
var authenticate = require('../middleware/authenticate');
var authorize = require('../middleware/authorize');
var jwt = require('jsonwebtoken');
var Database = require('../helpers/database');
var Email = require('../helpers/email/email');
var ErrorType = require('../constants/error-type');

router.post('/authenticate', authenticate, async function(req, res, next) {
  res.json({ isSuccess: true, token: res.token, user: res.user });
});

router.post('/authorize', authorize, async function(req, res, next) {
  res.json({ isSuccess: true, user: req.user });
});

router.post('/register', async function(req, res, next) {
  var existingUser = await Database.User.findOne({ $or: [{ username: req.body.username }, { emailAddress: req.body.emailAddress }] }).exec();
  if (existingUser) {
    if (existingUser.username == req.body.username) {
      res.json({ isSuccess: false, errorCode: ErrorType.USERNAME_TAKEN, errorMessage: 'This username is already taken.' });
    } else {
      res.json({ isSuccess: false, errorCode: ErrorType.EMAIL_TAKEN, errorMessage: 'This email address is already taken.' });
    }
  } else {
    var newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      emailAddress: req.body.emailAddress,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      imageUrl: req.body.imageUrl
    };
    Database.User.create(newUser)
      .then(async createdUser => {

        await Email.send(createdUser.emailAddress, 'Welcome to iWagerGames ' + createdUser.firstName + '!', 'Thank you for joining the iWagerGames platform', Email.templates.WELCOME)
          .then(() => {}, error => console.error('Email error: ' + error.message))
          .catch(error => console.error('Email error: ' + error.message));

        var token = jwt.sign({ }, process.env.TOKEN_SECRET, { subject: createdUser._id.toString(), issuer: 'iWagerGames', expiresIn: '1d' });
        res.json({ isSuccess: true, user: createdUser, token: token });
      })
      .catch(error => { 
        res.json({ isSuccess: false, errorCode: ErrorType.DATABASE_PROBLEM, errorMessage: error.message });
      });
  }
});

router.get('/:id', async function(req, res, next) {
  var response = { isSuccess: false };

  response.user = await Database.User.findById(req.params.id).exec()
    .catch((error) => { response.errorMessage = error.message; });
  response.isSuccess = response.user != null;
  
  res.json(response);
});

module.exports = router;

