const express = require('express');
const router = express.Router();
const { login, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authmiddleware');
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/me', authMiddleware, (req, res) => {
  res.json({ usuario: req.user });
});
module.exports = router;