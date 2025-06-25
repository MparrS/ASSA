// backend/routes/usersRoutes.js

const express = require("express");
const router = express.Router();
const db     = require("../config/db");
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

// ─── Helpers ────────────────────────────────────────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
const PROFILE_DIR = path.join(
  __dirname, "..", "..",
  "frontend", "public", "assets", "profile"
);
ensureDir(PROFILE_DIR);

// ─── Multer config ─────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PROFILE_DIR),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE","Solo imágenes"));
  }
});

// ─── GET /api/users ─────────────────────────────────────────────────────────
// Lista todos los usuarios
router.get("/", async (req, res, next) => {
  try {
    const conn = await db;
    const [rows] = await conn.promise().query(
      `SELECT 
         id, name, username, email,
         phone, country, rol, points,
         direccionLaboral, profilePicture
       FROM users`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:id ─────────────────────────────────────────────────────
// Devuelve un usuario por su ID
router.get("/:id", async (req, res, next) => {
  try {
    const conn = await db;
    const [rows] = await conn.promise().query(
      `SELECT
         id, name, username, email,
         phone, country, direccionLaboral,
         rol, points, profilePicture
       FROM users
       WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error:"Usuario no existe" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/users/:id ─────────────────────────────────────────────────────
// Edita datos de perfil (con o sin foto)
router.put(
  "/:id",
  upload.single("profilePicture"),
  async (req, res, next) => {
    try {
      const {
        name,
        username,
        email,
        phone,
        country,
        direccionLaboral,
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
           profilePicture  = ?
         WHERE id = ?`,
        [
          name,
          username,
          email,
          phone,
          country,
          direccionLaboral,
          profilePicture,
          req.params.id
        ]
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ error:"Usuario no encontrado" });

      const [rows] = await conn.promise().query(
        `SELECT
           id, name, username, email,
           phone, country, direccionLaboral,
           rol, points, profilePicture
         FROM users
         WHERE id = ?`,
        [req.params.id]
      );
      res.json(rows[0]);
    } catch (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  }
);

// ─── DELETE /api/users/:id ──────────────────────────────────────────────────
// Borra un usuario y sus datos asociados
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const conn = await db;

    // Opcional: borrar comentarios, posts, likes...
    await conn.promise().execute("DELETE FROM comments WHERE userId = ?", [id]);
    await conn.promise().execute("DELETE FROM post_likes WHERE userId = ?", [id]);
    await conn.promise().execute("DELETE FROM posts WHERE userId = ?", [id]);

    // Borra el usuario
    const [result] = await conn.promise().execute(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ status: "deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
