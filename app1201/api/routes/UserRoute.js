// routes/UserRoute.js
const express = require('express');
const user = require('../controllers/UserController');

const router = express.Router();

router.post('/register', user.register);
router.post('/login', user.login);

router.get('/index', (req, res) => {
  res.json({ access: true });
});

module.exports = router;
