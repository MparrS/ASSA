// backend/routes/usersRoutes.js

const express = require("express");
const router  = express.Router();
const db      = require("../config/db");
const bcrypt  = require("bcrypt");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

// — Helpers: crea directorio de perfil si no existe —
const PROFILE_DIR = path.join(
  __dirname, "..", "..",
  "frontend", "public", "assets", "profile"
);
if (!fs.existsSync(PROFILE_DIR)) {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
}

// — Multer config para subir foto de perfil —
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, PROFILE_DIR),
  filename:    (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Solo imágenes"));
    }
  }
});

// — POST /api/users — Crear usuario con contrasena = hash(documento) —
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      username,
      documento,
      email,
      phone,
      country,
      rol,
      points,
      direccionLaboral
    } = req.body;

    if (!name || !username || !email || !documento) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Hash del documento para contrasena inicial
    const hash = await bcrypt.hash(documento.toString(), 10);

    const conn = await db;
    const [result] = await conn.promise().execute(
      `INSERT INTO users
         (name, username, documento, email, phone, country, rol, points, direccionLaboral, contrasena)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        username,
        documento,
        email,
        phone || null,
        country || null,
        rol || "empleado",
        points || 0,
        direccionLaboral || null,
        hash
      ]
    );

    // Devolver usuario sin contrasena
    const [rows] = await conn.promise().query(
      `SELECT
         id, name, username, documento, email,
         phone, country, rol, points, direccionLaboral, profilePicture
       FROM users WHERE id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "El usuario o correo ya existe" });
      }
      console.error("Error en POST /api/users:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
});

// — GET /api/users — Listar todos los usuarios (sin contrasena) —
router.get("/", async (req, res, next) => {
  try {
    const conn = await db;
    const [rows] = await conn.promise().query(
      `SELECT
         id, name, username, documento, email,
         phone, country, rol, points, direccionLaboral, profilePicture
       FROM users`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// — GET /api/users/:id — Obtener un usuario por ID —
router.get("/:id", async (req, res, next) => {
  try {
    const conn = await db;
    const [rows] = await conn.promise().query(
      `SELECT
         id, name, username, documento, email,
         phone, country, rol, points, direccionLaboral, profilePicture
       FROM users WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Usuario no existe" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});
// — PUT /api/users/:id — Editar usuario (incluye foto de perfil) —
router.put("/:id", upload.single("profilePicture"), async (req, res, next) => {
  try {
    const {
      name,
      username,
      email,
      phone,
      country,
      direccionLaboral,
      rol,
      points,
      existingProfilePicture
    } = req.body;

    const profilePicture = req.file
      ? `/assets/profile/${req.file.filename}`
      : existingProfilePicture || null;

    const conn = await db;
    const [result] = await conn.promise().execute(
      `UPDATE users SET
         name            = ?,
         username        = ?,
         email           = ?,
         phone           = ?,
         country         = ?,
         direccionLaboral= ?,
         rol             = ?,
         points          = ?,
         profilePicture  = ?
       WHERE id = ?`,
      [
        name,
        username,
        email,
        phone,
        country,
        direccionLaboral,
        rol,
        points,
        profilePicture,
        req.params.id
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const [rows] = await conn.promise().query(
      `SELECT
         id, name, username, documento, email,
         phone, country, rol, points, direccionLaboral, profilePicture
       FROM users WHERE id = ?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// — DELETE /api/users/:id — Borrar usuario y dependencias —
router.delete("/:id", async (req, res, next) => {
  try {
    const conn = await db;
    await conn.promise().execute("DELETE FROM comments WHERE userId = ?", [req.params.id]);
    await conn.promise().execute("DELETE FROM post_likes WHERE userId = ?", [req.params.id]);
    await conn.promise().execute("DELETE FROM posts WHERE userId = ?", [req.params.id]);

    const [result] = await conn.promise().execute(
      "DELETE FROM users WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ status: "deleted" });
  } catch (err) {
    next(err);
  }
});

// — POST /api/users/:id/reset-password — Resetear contrasena al documento —
router.post("/:id/reset-password", async (req, res, next) => {
  try {
    const conn = await db;
    const [[user]] = await conn.promise().query(
      "SELECT documento FROM users WHERE id = ?",
      [req.params.id]
    );
    if (!user) {
      return res.status(404).json({ error: "Usuario no existe" });
    }
    const hash = await bcrypt.hash(user.documento.toString(), 10);
    await conn.promise().execute(
      "UPDATE users SET contrasena = ? WHERE id = ?",
      [hash, req.params.id]
    );
    res.json({ status: "password reset" });
  } catch (err) {
    next(err);
  }
});

// — PUT /api/users/:id/password — Cambiar contrasena manualmente —
router.put("/:id/password", async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: "Contraseña demasiado corta" });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    const conn = await db;
    const [result] = await conn.promise().execute(
      "UPDATE users SET contrasena = ? WHERE id = ?",
      [hash, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ status: "password changed" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
