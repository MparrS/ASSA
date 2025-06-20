// backend/routes/spacesRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Query devuelve espacios + posts + comentarios + imágenes
const getSpacesQuery = `
  SELECT 
    s.id AS spaceId,
    s.name AS spaceName,
    s.description AS spaceDescription,
    su.id AS spaceUserId,
    su.name AS spaceUserName,

    p.id AS postId,
    p.title AS postTitle,
    p.body AS postBody,
    p.date AS postDate,
    p.likes AS postLikes,
    p.commentsCount AS postCommentsCount,
    pu.id AS postUserId,
    pu.name AS postUserName,

    c.id AS commentId,
    c.body AS commentBody,
    c.date AS commentDate,
    cu.id AS commentUserId,
    cu.name AS commentUserName,

    pi.imagePath AS postImage
  FROM spaces s
  LEFT JOIN users su ON s.userId = su.id
  LEFT JOIN posts p ON s.id = p.spaceId
  LEFT JOIN users pu ON p.userId = pu.id
  LEFT JOIN comments c ON p.id = c.postId
  LEFT JOIN users cu ON c.userId = cu.id
  LEFT JOIN post_images pi ON p.id = pi.postId
  ORDER BY s.id, p.id, c.id;
`;

// Auxiliar para agrupar filas en objetos anidados
function formatSpacesData(rows) {
  const spaces = [];
  const map = {};
  rows.forEach(r => {
    if (!map[r.spaceId]) {
      map[r.spaceId] = {
        id: r.spaceId,
        name: r.spaceName,
        description: r.spaceDescription,
        user: { id: r.spaceUserId, name: r.spaceUserName },
        posts: []
      };
      spaces.push(map[r.spaceId]);
    }
    if (r.postId) {
      let post = map[r.spaceId].posts.find(p => p.id === r.postId);
      if (!post) {
        post = {
          id: r.postId,
          title: r.postTitle,
          body: r.postBody,
          date: r.postDate,
          likes: r.postLikes,
          commentsCount: r.postCommentsCount,
          user: { id: r.postUserId, name: r.postUserName },
          comments: [],
          images: []
        };
        map[r.spaceId].posts.push(post);
      }
      if (r.commentId && !post.comments.find(c => c.id === r.commentId)) {
        post.comments.push({
          id: r.commentId,
          body: r.commentBody,
          date: r.commentDate,
          user: { id: r.commentUserId, name: r.commentUserName }
        });
      }
      if (r.postImage && !post.images.includes(r.postImage)) {
        post.images.push(r.postImage);
      }
    }
  });
  return spaces;
}

// GET /api/spaces → lista de todos los espacios
router.get("/", (req, res) => {
  db.query(getSpacesQuery, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const spaces = formatSpacesData(rows);
    res.json({ spaces });
  });
});

module.exports = router;
