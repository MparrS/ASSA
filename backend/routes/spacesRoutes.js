const express = require('express');
const router = express.Router();
const db = require("../config/db");

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

function formatSpacesData(results) {
  const spaces = [];
  const spacesMap = {};

  results.forEach(row => {
    if (!spacesMap[row.spaceId]) {
      spacesMap[row.spaceId] = {
        id: row.spaceId,
        name: row.spaceName,
        description: row.spaceDescription,
        user: {
          id: row.spaceUserId,
          name: row.spaceUserName
        },
        posts: []
      };
      spaces.push(spacesMap[row.spaceId]);
    }

    if (row.postId) {
      let post = spacesMap[row.spaceId].posts.find(p => p.id === row.postId);
      if (!post) {
        post = {
          id: row.postId,
          title: row.postTitle,
          body: row.postBody,
          date: row.postDate,
          likes: row.postLikes,
          commentsCount: row.commentsCount,
          user: {
            id: row.postUserId,
            name: row.postUserName
          },
          comments: [],
          images: []
        };
        spacesMap[row.spaceId].posts.push(post);
      }

      if (row.commentId && !post.comments.find(c => c.id === row.commentId)) {
        post.comments.push({
          id: row.commentId,
          body: row.commentBody,
          date: row.commentDate,
          user: {
            id: row.commentUserId,
            name: row.commentUserName
          }
        });
      }

      if (row.postImage && !post.images.includes(row.postImage)) {
        post.images.push(row.postImage);
      }
    }
  });

  return spaces;
}

router.get('/', (req, res) => {
  db.query(getSpacesQuery, (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).json({ error: 'Error en la consulta de la base de datos.' });
    }

    const spaces = formatSpacesData(results);
    res.json({ spaces });
  });
});

module.exports = router;
