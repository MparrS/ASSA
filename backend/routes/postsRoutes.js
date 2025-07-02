const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
const POSTS_DIR = path.join(
  __dirname, "..", "..", "frontend", "public", "assets", "posts"
);
ensureDir(POSTS_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, POSTS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Solo imágenes y vídeos"));
    }
  }
});

router.get("/", async (req, res, next) => {
  try {
    const conn = await db;
    const sql = `
      SELECT 
        p.id, p.userId, p.title, p.body, p.date, p.likes, p.commentsCount, p.spaceId,
        u.name AS userName, u.username AS userUsername, u.profilePicture AS userProfilePicture,
        IFNULL(GROUP_CONCAT(DISTINCT pi.imagePath SEPARATOR ','), '') AS post_media,
        IFNULL(
          GROUP_CONCAT(
            DISTINCT CONCAT(
              c.id,'||',c.body,'||',c.date,'||',
              cu.name,'||',cu.username,'||',cu.profilePicture
            ) SEPARATOR '&&'
          ), ''
        ) AS comments
      FROM posts p
      JOIN users u ON p.userId = u.id
      LEFT JOIN post_images pi ON pi.postId = p.id
      LEFT JOIN comments c ON c.postId = p.id
      LEFT JOIN users cu ON c.userId = cu.id
      GROUP BY p.id
      ORDER BY p.date DESC;
    `;
    const [rows] = await conn.promise().query(sql);

    const posts = rows.map(r => {
      const media = r.post_media
        .split(",")
        .filter(Boolean)
        .map(url => {
          const ext = url.split(".").pop().toLowerCase();
          return {
            url,
            type: ["mp4","mov","avi","webm"].includes(ext) ? "video" : "image"
          };
        });

      const comments = r.comments
        .split("&&")
        .filter(Boolean)
        .map(chunk => {
          const [id, body, date, name, username, profilePicture] = chunk.split("||");
          return { id, body, date, name, username, profilePicture };
        });

      return {
        id: r.id,
        userId: r.userId,
        spaceId: r.spaceId,
        title: r.title,
        body: r.body,
        date: r.date,
        likes: r.likes,
        commentsCount: r.commentsCount,
        userName: r.userName,
        userUsername: r.userUsername,
        userProfilePicture: r.userProfilePicture,
        media,
        comments
      };
    });

    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.post("/", upload.array("media", 10), async (req, res, next) => {
  try {
    const { uid, displayName, content, spaceId } = req.body;
    if (!uid || !content || !spaceId) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const mediaUrls = (req.files || []).map(f =>
      `${req.protocol}://${req.get("host")}/assets/posts/${f.filename}`
    );

    const conn = await db;
    const now = new Date().toISOString();
    const [result] = await conn.promise().execute(
      `INSERT INTO posts
         (userId, title, body, date, likes, commentsCount, spaceId)
       VALUES (?, ?, ?, ?, 0, 0, ?)`,
      [uid, "", content, now, parseInt(spaceId, 10)]
    );
    const postId = result.insertId;

    if (mediaUrls.length) {
      const vals = mediaUrls.map(url => [postId, url]);
      await conn.promise().query(
        "INSERT INTO post_images (postId, imagePath) VALUES ?",
        [vals]
      );
    }

    res.status(201).json({ id: postId, content, media: mediaUrls, createdAt: now });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/like", async (req, res, next) => {
  const postId = req.params.id;
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "Falta uid" });

  try {
    const conn = await db;
    await conn.promise().execute(
      "INSERT IGNORE INTO post_likes (postId, userId) VALUES (?, ?)",
      [postId, uid]
    );
    const [[{ cnt }]] = await conn.promise().query(
      "SELECT COUNT(*) AS cnt FROM post_likes WHERE postId = ?",
      [postId]
    );
    await conn.promise().execute(
      "UPDATE posts SET likes = ? WHERE id = ?",
      [cnt, postId]
    );
    res.json({ status: "success", likes: cnt });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/unlike", async (req, res, next) => {
  const postId = req.params.id;
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "Falta uid" });

  try {
    const conn = await db;
    await conn.promise().execute(
      "DELETE FROM post_likes WHERE postId = ? AND userId = ?",
      [postId, uid]
    );
    const [[{ cnt }]] = await conn.promise().query(
      "SELECT COUNT(*) AS cnt FROM post_likes WHERE postId = ?",
      [postId]
    );
    await conn.promise().execute(
      "UPDATE posts SET likes = ? WHERE id = ?",
      [cnt, postId]
    );
    res.json({ status: "success", likes: cnt });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/isLiked", async (req, res, next) => {
  const postId = req.params.id;
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: "Falta uid" });

  try {
    const conn = await db;
    const [[row]] = await conn.promise().query(
      "SELECT 1 FROM post_likes WHERE postId = ? AND userId = ? LIMIT 1",
      [postId, uid]
    );
    res.json({ isLiked: !!row });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", upload.array("media", 10), async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title = "", body = "" } = req.body;

    const conn = await db;
    await conn.promise().execute(
      "UPDATE posts SET title = ?, body = ? WHERE id = ?",
      [title, body, postId]
    );
    if (req.files?.length) {
      const urls = req.files.map(f =>
        `${req.protocol}://${req.get("host")}/assets/posts/${f.filename}`
      );
      const vals = urls.map(url => [postId, url]);
      await conn.promise().query(
        "INSERT INTO post_images (postId, imagePath) VALUES ?",
        [vals]
      );
    }
    res.json({ status: "updated" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const postId = req.params.id;
    const conn = await db;
    await conn.promise().execute(
      "DELETE FROM post_images WHERE postId = ?",
      [postId]
    );
    await conn.promise().execute(
      "DELETE FROM comments WHERE postId = ?",
      [postId]
    );
    await conn.promise().execute(
      "DELETE FROM post_likes WHERE postId = ?",
      [postId]
    );
    const [result] = await conn.promise().execute(
      "DELETE FROM posts WHERE id = ?",
      [postId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    res.json({ status: "deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;