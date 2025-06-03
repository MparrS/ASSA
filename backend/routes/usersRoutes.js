// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET: Obtener información del usuario por su ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db;
    const query = `
      SELECT id, name, username, email, profilePicture, phone, country
      FROM users
      WHERE id = ?
    `;
    const [rows] = await connection.promise().query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

// PUT: Actualizar la información del usuario
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Campos que se esperan actualizar. Ajusta según tu esquema de DB.
    const { name, phone, country, profilePicture } = req.body;
    const connection = await db;
    const updateQuery = `
      UPDATE users 
      SET name = ?, phone = ?, country = ?, profilePicture = ?
      WHERE id = ?
    `;
    const [result] = await connection.promise().execute(updateQuery, [
      name,
      phone,
      country,
      profilePicture,
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Recuperamos la información actualizada
    const selectQuery = `
      SELECT id, name, username, email, profilePicture, phone, country
      FROM users
      WHERE id = ?
    `;
    const [rows] = await connection.promise().query(selectQuery, [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

module.exports = router;
