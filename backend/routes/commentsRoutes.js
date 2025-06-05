// routes/commentsRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint GET para traer comentarios (ya existente)
router.get('/', async (req, res) => {
  try {
    const { postId } = req.query;
    const connection = await db;
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

// NUEVO: Endpoint POST para publicar comentarios
router.post('/', async (req, res) => {
  try {
    const { postId, userId, body, date, likes } = req.body;
    const connection = await db;
    const query = "INSERT INTO comments (postId, userId, body, date, likes) VALUES (?, ?, ?, ?, ?)";
    const [result] = await connection.promise().execute(query, [postId, userId, body, date, likes || 0]);
    res.status(201).json({ commentId: result.insertId });
  } catch (error) {
    console.error("Error al publicar el comentario:", error);
    res.status(500).json({ error: "Error al publicar el comentario" });
  }
});

module.exports = router;
