// authController.js
const util = require('util');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const query = util.promisify(db.query).bind(db);

const login = async (req, res) => {
  try {
    const { documento, contrasena } = req.body;

    if (!documento || !contrasena) {
      return res.status(400).json({ message: 'Documento y contraseña son requeridos' });
    }

    const results = await query('SELECT * FROM users WHERE documento = ?', [documento]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = results[0];

    // Validar contraseña (texto plano o mediante bcrypt)
    const match = usuario.contrasena === contrasena.toString() ||
      await bcrypt.compare(contrasena.toString(), usuario.contrasena);

    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Actualizar último login
    await query('UPDATE users SET ultimologin = NOW() WHERE id = ?', [usuario.id]);

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, documento: usuario.documento, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // NOTA: Se asigna displayName usando el valor de la columna "nombre"
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        displayName: usuario.nombre, // <-- Aquí se asigna
        profilePicture: usuario.profilePicture, // asegúrate de que exista
        rol: usuario.rol,
        puntos: usuario.puntos,
        email: usuario.email,
        phone: usuario.phone,
        country: usuario.country,
        ultimologin: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // Traer la información completa y usar alias para el nombre
    const results = await query(
      'SELECT id, nombre AS displayName, profilePicture, rol, email, phone, country, puntos, ultimologin FROM users WHERE id = ?',
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ usuario: results[0] });
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login, getUserProfile };
