// backend/routes/postsRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");           // Conexión al pool de MySQL
const multer = require("multer");
const path = require("path");

// ─── 1) Configuración de multer para subir imágenes ──────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta absoluta: frontend/public/assets/posts
    const dest = path.join(
      __dirname, "..", "..",
      "frontend", "public", "assets", "posts"
    );
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + extensión original
    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// ─── GET /api/posts ───────────────────────────────────────────────────────────
// Devuelve todos los posts con sus imágenes y comentarios
router.get("/", async (req, res) => {
  try {
    const connection = await db;
    const query = `
      SELECT 
        p.id, p.userId, p.title, p.body, p.date, p.likes, p.commentsCount, p.spaceId,
        u.name AS userName, u.username AS userUsername, u.profilePicture AS userProfilePicture,
        IFNULL(GROUP_CONCAT(DISTINCT pi.imagePath SEPARATOR ','), '') AS post_images,
        IFNULL(
          GROUP_CONCAT(
            DISTINCT CONCAT(
              c.id, '||', c.body, '||', c.date, '||',
              cu.name, '||', cu.username, '||', cu.profilePicture
            ) SEPARATOR '&&'
          ), ''
        ) AS comments
      FROM posts p
      JOIN users u      ON p.userId   = u.id
      LEFT JOIN post_images pi ON pi.postId = p.id
      LEFT JOIN comments c     ON c.postId  = p.id
      LEFT JOIN users cu       ON c.userId  = cu.id
      GROUP BY p.id
      ORDER BY p.date DESC;
    `;
    const [results] = await connection.promise().query(query);
    const posts = results.map(row => ({
      id: row.id,
      userId: row.userId,
      spaceId: row.spaceId,
      title: row.title,
      body: row.body,
      date: row.date,
      likes: row.likes,
      commentsCount: row.commentsCount,
      userName: row.userName,
      userUsername: row.userUsername,
      userProfilePicture: row.userProfilePicture,
      post_images: row.post_images
        ? row.post_images.split(",")
        : [],
      comments: row.comments
        ? row.comments.split("&&").map(item => {
            const [id, body, date, name, username, profilePicture] =
              item.split("||");
            return { id, body, date, name, username, profilePicture };
          })
        : []
    }));
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

// ─── POST /api/posts ──────────────────────────────────────────────────────────
// Crea un nuevo post, opcionalmente con múltiples imágenes.
// Recibe FormData con campos: uid, displayName, content, spaceId, image[].
router.post("/", upload.array("image", 10), async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { uid, displayName, content, spaceId } = req.body;

    // Validación de campos obligatorios
    if (!uid || !content) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios: uid o content" });
    }

    // Preparamos array de URLs de las imágenes subidas
    let imageUrls = [];
    if (req.files && req.files.length) {
      imageUrls = req.files.map(file => {
        // URL pública bajo /assets/posts/filename
        return `${req.protocol}://${req.get("host")}/assets/posts/${file.filename}`;
      });
      console.log("URLs de imágenes generadas:", imageUrls);
    }

    const connection = await db;
    const currentDate = new Date().toISOString();

    // Convertimos spaceId a número o null
    const sid = spaceId ? parseInt(spaceId, 10) : null;

    // Insertamos el post con el campo spaceId
    const insertPostQuery = `
      INSERT INTO posts
        (userId, title, body, date, likes, commentsCount, spaceId)
      VALUES (?, ?, ?, ?, 0, 0, ?)
    `;
    const [result] = await connection
      .promise()
      .execute(insertPostQuery, [uid, "", content, currentDate, sid]);
    const postId = result.insertId;
    console.log("Post insertado con ID:", postId);

    // Si hay imágenes, las insertamos en post_images
    if (imageUrls.length > 0) {
      const insertImgsQuery = `
        INSERT INTO post_images (postId, imagePath)
        VALUES ?
      `;
      const values = imageUrls.map(url => [postId, url]);
      await connection.promise().query(insertImgsQuery, [values]);
      console.log("Imágenes insertadas en post_images");
    }

    // Respuesta con datos del post creado
    res.status(201).json({
      id: postId,
      uid,
      displayName,
      content,
      spaceId: sid,
      images: imageUrls,
      createdAt: currentDate
    });
  } catch (error) {
    console.error("Error al crear post:", error);
    res.status(500).json({ error: "Error al crear post", details: error.message });
  }
});

// ─── POST /api/posts/:id/like ─────────────────────────────────────────────────
// Incrementa en 1 el contador de likes de un post
router.post("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db;
    const [result] = await connection
      .promise()
      .execute("UPDATE posts SET likes = likes + 1 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(404).json({ error: "Post no encontrado" });
    }
  } catch (error) {
    console.error("Error al dar like:", error);
    res.status(500).json({ error: "Error al dar like" });
  }
});

// ─── POST /api/posts/:id/unlike ────────────────────────────────────────────────
// Decrementa en 1 el contador de likes (sin bajar de 0)
router.post("/:id/unlike", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db;
    const [result] = await connection.promise().execute(
      "UPDATE posts SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(404).json({ error: "Post no encontrado o sin likes" });
    }
  } catch (error) {
    console.error("Error al quitar like:", error);
    res.status(500).json({ error: "Error al quitar like" });
  }
});

module.exports = router;
