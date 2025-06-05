const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Conexión a MySQL
const multer = require("multer");
const path = require("path");

// Para múltiples archivos, si quieres limitar la cantidad, por ejemplo 10:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Aseguramos la ruta correcta usando dos niveles ".."
    const dest = path.join(__dirname, "..", "..", "frontend", "public", "assets", "posts");
    console.log("Guardando archivo en:", dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});
const upload = multer({ storage });

// ------------------------------
// Endpoint GET: Obtener publicaciones
// MODIFICADO: Se agregó ORDER BY date DESC para que los posts más recientes aparezcan primero
// ------------------------------
router.get("/", async (req, res) => {
  try {
    const connection = await db;
    const query = `
      SELECT 
        p.id, 
        p.userId, 
        p.title, 
        p.body, 
        p.date, 
        p.likes, 
        p.commentsCount,
        u.name AS userName,
        u.username AS userUsername,
        u.profilePicture AS userProfilePicture,
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
      JOIN users u ON p.userId = u.id
      LEFT JOIN post_images pi ON pi.postId = p.id
      LEFT JOIN comments c ON c.postId = p.id
      LEFT JOIN users cu ON c.userId = cu.id
      GROUP BY p.id
      ORDER BY p.date DESC  -- Ordenar posts por fecha descendente
    `;
    const [results] = await connection.promise().query(query);
    const posts = results.map(row => ({
      ...row,
      post_images: row.post_images ? row.post_images.split(',') : [],
      comments: row.comments
        ? row.comments.split("&&").map(item => {
            const parts = item.split("||");
            return {
              id: parts[0],
              body: parts[1],
              date: parts[2],
              name: parts[3],
              username: parts[4],
              profilePicture: parts[5],
            };
          })
        : [],
    }));
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

// ------------------------------
// Endpoint POST: Crear nuevo post (texto e imágenes opcionales)
// MODIFICADO: Uso de upload.array y ciclo para procesar todas las imágenes
// ------------------------------
router.post("/", upload.array("image", 10), async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { uid, displayName, content } = req.body;
    if (!uid || !content) {
      console.error("Faltan campos obligatorios:", req.body);
      return res.status(400).json({ error: "Faltan campos obligatorios (uid o content)" });
    }
    let imageUrls = [];
    if (req.files && req.files.length) {
      req.files.forEach(file => {
        const url = `${req.protocol}://${req.get("host")}/assets/posts/${file.filename}`;
        imageUrls.push(url);
      });
      console.log("URLs de imágenes:", imageUrls);
    }
    const connection = await db;
    const currentDate = new Date().toISOString();
    const query = "INSERT INTO posts (userId, body, date, likes, commentsCount) VALUES (?, ?, ?, 0, 0)";
    const [result] = await connection.promise().execute(query, [uid, content, currentDate]);
    const postId = result.insertId;
    console.log("Post insertado con id:", postId);

    if (imageUrls.length > 0) {
      for (let url of imageUrls) {
        const imageQuery = "INSERT INTO post_images (postId, imagePath) VALUES (?, ?)";
        await connection.promise().execute(imageQuery, [postId, url]);
      }
      console.log("Todas las imágenes fueron insertadas en post_images");
    }
    res.status(201).json({
      id: postId,
      uid,
      displayName,
      content,
      images: imageUrls,
      createdAt: currentDate,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post", details: error.message });
  }
});

// Endpoints para dar y quitar like (sin cambios)
router.post("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db;
    const query = "UPDATE posts SET likes = likes + 1 WHERE id = ?";
    const [result] = await connection.promise().execute(query, [id]);
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

router.post("/:id/unlike", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db;
    const query = "UPDATE posts SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = ?";
    const [result] = await connection.promise().execute(query, [id]);
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
  