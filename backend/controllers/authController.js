const util = require('util');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Promisificamos el query para usar async/await
const query = util.promisify(db.query).bind(db);

const login = async (req, res) => {
  try {
    const { documento, contrasena } = req.body;

    if (!documento || !contrasena) {
      return res.status(400).json({ message: 'Documento y contraseña son requeridos' });
    }

    // Buscar usuario por documento
    const results = await query('SELECT * FROM usuarios WHERE documento = ?', [documento]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = results[0];

    // Validar contraseña (texto plano o bcrypt)
    const match = usuario.contrasena === contrasena.toString() || await bcrypt.compare(contrasena.toString(), usuario.contrasena);

    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Actualizar ultimo_login
    await query('UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?', [usuario.id]);

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, documento: usuario.documento, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        puntos: usuario.puntos,
        ultimo_login: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // asumiendo que authMiddleware setea req.user

    const results = await query('SELECT id, nombre, documento, rol, puntos, ultimo_login FROM usuarios WHERE id = ?', [userId]);

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
