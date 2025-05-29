const express = require('express');
const router = express.Router();
const PublicacionesModel = require('../models/publicaciones');

// Obtener todas las publicaciones
router.get('/', async (req, res) => {
  try {
    const publicaciones = await PublicacionesModel.obtenerPublicaciones();
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener publicaciones' });
  }
});

// Crear nueva publicación
router.post('/', async (req, res) => {
  const { usuario_id, espacio_id, titulo, contenido } = req.body;

  if (!usuario_id || !espacio_id || !contenido) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    await PublicacionesModel.crearPublicacion({ usuario_id, espacio_id, titulo, contenido });
    res.status(201).json({ message: 'Publicación creada exitosamente' });
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).json({ message: 'Error al crear la publicación' });
  }
});

module.exports = router;
