// controllers/UserController.js
const User = require('../models/User');

exports.register = function (req, res) {
  const { username, email, password, passwordConfirmation } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'Please provide email or password' });
  }
  if (password !== passwordConfirmation) {
    return res.status(422).json({ error: 'Password does not match' });
  }
  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return res.status(422).json({ error: 'User already exist' });
    }
    const user = new User({
      username,
      email,
      password,
    });
    user.save((err) => {
      if (err) {
        res.status(422).json({ error: 'Ooops! something went wrong' });
      } else {
        return res.status(200).json({ registered: true });
      }
    });
  });
};

exports.login = function (req, res) {};
