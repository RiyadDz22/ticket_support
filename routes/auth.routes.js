const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');

// Signup Route
router.post('/signup', signup);
router.post('/login', login);
const authJwt = require('../middleware/authJwt');

router.get('/protected-route', authJwt.verifyToken, (req, res) => {
    res.status(200).json({ message: 'You are authorized!', user: req.user });
});

module.exports = router;
