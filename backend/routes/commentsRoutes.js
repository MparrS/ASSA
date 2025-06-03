// Archivo: routes/commentsRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint GET para traer comentarios con datos de usuario:
router.get('/', async (req, res) => {
  try {
    const { postId } = req.query;
    const connection = await db;
    // Asegúrate de que los nombres de las columnas coincidan con tu BD.
    const query = `
      SELECT c.*, u.username, u.profilePicture
      FROM comments c 
      LEFT JOIN users u ON c.userId = u.id 
      WHERE c.postId = ?
      ORDER BY c.date ASC
    `;
    const [rows] = await connection.promise().execute(query, [postId]);
    res.status(200).json({ comments: rows });
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

module.exports = router;
