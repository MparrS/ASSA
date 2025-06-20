// backend/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const postsRoutes    = require("./routes/postsRoutes");
const authRoutes     = require("./routes/authRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const usersRoutes    = require("./routes/usersRoutes");
const spacesRoutes   = require("./routes/spacesRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Sirve imágenes estáticas desde frontend/public/assets
app.use("/assets", express.static(path.join(__dirname, "..", "frontend", "public", "assets")));

// Rutas API
app.use("/api/posts",    postsRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/users", usersRoutes);  
app.use("/api/spaces", spacesRoutes);


app.get("/", (req, res) => res.send("API funcionando"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
