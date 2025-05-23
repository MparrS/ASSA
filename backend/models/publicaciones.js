const express = require('express');
const db = require('../config/db');
const router = express.Router();


router.get('/publicaciones', async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.contenido, p.fecha_publicacion, u.nombre as usuario_nombre, e.nombre as espacio_nombre
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN espacios e ON p.espacio_id = e.id
      WHERE p.estado = 'Activo'`;

    const result = await db.query(query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener las publicaciones' });
  }
});

// Crear una nueva publicación
router.post('/publicaciones', async (req, res) => {
  const { usuario_id, espacio_id, contenido } = req.body;

  if (!usuario_id || !espacio_id || !contenido) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const query = 'INSERT INTO publicaciones (usuario_id, espacio_id, contenido) VALUES (?, ?, ?)';
    await db.query(query, [usuario_id, espacio_id, contenido]);
    res.status(201).json({ message: 'Publicación creada exitosamente' });
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).json({ message: 'Error al crear la publicación' });
  }
});

module.exports = router;
