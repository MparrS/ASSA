const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const postsRoutes    = require("./routes/postsRoutes");
const authRoutes     = require("./routes/authRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const usersRoutes    = require("./routes/usersRoutes");
const spacesRoutes   = require("./routes/spacesRoutes");

const app = express();
app.use(cors());

// 1) JSON + 2) URL‐encoded (para formularios multipart multer hará match sólo sus archivos)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3) Sirve estáticos (imágenes y vídeos subidos, incluyendo perfil)
app.use(
  "/assets",
  express.static(path.join(__dirname, "..", "frontend", "public", "assets"))
);

// Rutas
app.use("/api/posts",    postsRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/users",    usersRoutes);
app.use("/api/spaces",   spacesRoutes);

// Healthcheck
app.get("/", (req, res) => res.send("API funcionando"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Servidor escuchando en puerto ${PORT}`)
);
