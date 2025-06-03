const express = require('express');
const router = express.Router();
const { login, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authmiddleware');
router.post('/login', login);
// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware, getUserProfile);
// Ruta protegida para obtener el usuario autenticado desde el token
router.get('/me', authMiddleware, (req, res) => {
  res.json({ usuario: req.user });
});

module.exports = router;