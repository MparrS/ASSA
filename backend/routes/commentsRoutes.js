// Archivo: routes/commentsRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
  try {
    const { postId, userId, body, date, likes } = req.body;
    const connection = await db;
    const query = "INSERT INTO comments (postId, userId, body, date, likes) VALUES (?, ?, ?, ?, ?)";
    const values = [postId, userId, body, date, likes];
    const [result] = await connection.promise().execute(query, values);
    res.status(201).json({ commentId: result.insertId });
  } catch (error) {
    console.error("Error al insertar comentario:", error);
    res.status(500).json({ error: "Error al insertar comentario" });
  }
});

module.exports = router;
