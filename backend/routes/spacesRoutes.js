const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener todos los espacios con posts, autores, comentarios e imágenes
const getSpacesQuery = `
  SELECT 
    s.id AS spaceId,
    s.name AS spaceName,
    s.description AS spaceDescription,
    s.icon AS spaceIcon,
    s.cover_image AS spaceCover,
    s.video_url AS spaceVideo,

    sa.user_id AS adminId,
    u.username AS adminUsername,

    p.id AS postId,
    p.title AS postTitle,
    p.body AS postBody,
    p.date AS postDate,
    p.likes AS postLikes,
    p.commentsCount AS postCommentsCount,
    pu.id AS postUserId,
    pu.username AS postUserName,

    c.id AS commentId,
    c.body AS commentBody,
    c.date AS commentDate,
    cu.id AS commentUserId,
    cu.username AS commentUserName,

    pi.imagePath AS postImage
  FROM spaces s
  LEFT JOIN space_admins sa ON s.id = sa.space_id
  LEFT JOIN users u ON sa.user_id = u.id

  LEFT JOIN posts p ON s.id = p.spaceId
  LEFT JOIN users pu ON p.userId = pu.id

  LEFT JOIN comments c ON p.id = c.postId
  LEFT JOIN users cu ON c.userId = cu.id

  LEFT JOIN post_images pi ON p.id = pi.postId
  ORDER BY s.id, p.id, c.id;
`;

// Formatear datos para agrupar por espacio y post
function formatSpacesData(results) {
  const spaces = [];
  const spaceMap = {};

  results.forEach((row) => {
    if (!spaceMap[row.spaceId]) {
      spaceMap[row.spaceId] = {
        id: row.spaceId,
        name: row.spaceName,
        description: row.spaceDescription,
        icon: row.spaceIcon,
        coverImage: row.spaceCover,
        video_url: row.spaceVideo,
        admins: [],
        posts: []
      };
      spaces.push(spaceMap[row.spaceId]);
    }

    const space = spaceMap[row.spaceId];

    // Agregar admin si no está
    if (
      row.adminId &&
      !space.admins.some((admin) => admin.id === row.adminId)
    ) {
      space.admins.push({
        id: row.adminId,
        username: row.adminUsername
      });
    }

    // Agregar post si no está
    if (row.postId) {
      let post = space.posts.find((p) => p.id === row.postId);
      if (!post) {
        post = {
          id: row.postId,
          title: row.postTitle,
          body: row.postBody,
          date: row.postDate,
          likes: row.postLikes,
          commentsCount: row.postCommentsCount,
          user: {
            id: row.postUserId,
            username: row.postUserName
          },
          comments: [],
          images: []
        };
        space.posts.push(post);
      }

      // Agregar comentario si no está
      if (
        row.commentId &&
        !post.comments.some((c) => c.id === row.commentId)
      ) {
        post.comments.push({
          id: row.commentId,
          body: row.commentBody,
          date: row.commentDate,
          user: {
            id: row.commentUserId,
            username: row.commentUserName
          }
        });
      }

      // Agregar imagen si no está
      if (row.postImage && !post.images.includes(row.postImage)) {
        post.images.push(row.postImage);
      }
    }
  });

  return spaces;
}

// GET /api/spaces → Obtener todos los espacios con info completa
router.get("/", (req, res) => {
  db.query(getSpacesQuery, (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      return res
        .status(500)
        .json({ error: "Error en la consulta de la base de datos." });
    }

    const spaces = formatSpacesData(results);
    res.json({ spaces });
  });
});

// GET /api/spaces/:id → Obtener info de un solo espacio
router.get("/:id", (req, res) => {
  const spaceId = req.params.id;

  const query = `
    SELECT 
      s.id, s.name, s.description, s.icon, s.cover_image, s.video_url,
      sa.user_id AS adminId, u.username AS adminUsername
    FROM spaces s
    LEFT JOIN space_admins sa ON s.id = sa.space_id
    LEFT JOIN users u ON sa.user_id = u.id
    WHERE s.id = ?
  `;

  db.query(query, [spaceId], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Espacio no encontrado" });
    }

    const espacio = {
      id: results[0].id,
      name: results[0].name,
      description: results[0].description,
      icon: results[0].icon,
      coverImage: results[0].cover_image,
      video_url: results[0].video_url,
      admins: []
    };

    results.forEach((row) => {
      if (row.adminId) {
        espacio.admins.push({
          id: row.adminId,
          username: row.adminUsername
        });
      }
    });

    res.json(espacio);
  });
});

module.exports = router;
