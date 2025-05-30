const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
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
    `;
    const [results] = await connection.promise().query(query);

    // Convertir las cadenas concatenadas en arreglos reales:
    const posts = results.map(row => ({
      ...row,
      post_images: row.post_images ? row.post_images.split(',') : [],
      comments: row.comments
        ? row.comments.split('&&').map(item => {
            const parts = item.split('||');
            return {
              id: parts[0],
              body: parts[1],
              date: parts[2],
              name: parts[3],
              username: parts[4],
              profilePicture: parts[5]
            };
          })
        : []
    }));

    res.json(posts);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

// Endpoint POST: Dar like a un post
router.post('/:id/like', async (req, res) => {
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

// Endpoint POST: Quitar like a un post
router.post('/:id/unlike', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db;
    const query = "UPDATE posts SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = ?";
    const [result] = await connection.promise().execute(query, [id]);
    if(result.affectedRows > 0) {
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
