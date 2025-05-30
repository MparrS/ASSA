const express = require('express');
const db = require('../config/db');  // Asegúrate de que la conexión a la base de datos esté configurada correctamente

const router = express.Router();

// Ruta para obtener los datos del usuario
router.get('/usuario', (req, res) => {
  const userId = 2; // Aquí puedes modificar para obtener el ID del usuario autenticado

  // Consulta a la base de datos para obtener los datos del usuario por ID
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    // Si el usuario existe, lo devolvemos en la respuesta
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      // Si el usuario no se encuentra
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
});

// Ruta para actualizar los datos del usuario
router.put('/usuario', (req, res) => {
  const { id, nombre, apellido, correo, celular_personal, linkedin } = req.body;

  // Verificamos que los datos necesarios estén presentes
  if (!id || !nombre || !apellido || !correo || !celular_personal || !linkedin) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Consulta SQL para actualizar los datos del usuario en la base de datos
  const query = `
    UPDATE users
    SET nombre = ?, apellido = ?, correo = ?, celular_personal = ?, linkedin = ?
    WHERE id = ?
  `;
  
  // Ejecutamos la consulta de actualización
  db.query(query, [nombre, apellido, correo, celular_personal, linkedin, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar los datos' });
    }

    // Si la actualización fue exitosa, lo devolvemos
    if (result.affectedRows > 0) {
      res.json({ message: 'Datos actualizados correctamente' });
    } else {
      // Si no se encontró el usuario o no se realizaron cambios
      res.status(404).json({ error: 'Usuario no encontrado o no se realizaron cambios' });
    }
  });
});

module.exports = router;
