const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const postsRoutes = require("./routes/postsRoutes");
const authRoutes = require("./routes/authRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const usersRoutes = require("./routes/usersRoutes");  // Importa las rutas de usuarios

// Definir la ruta absoluta para la carpeta de imágenes en el frontend
// Se asume que BACKEND y frontend están al mismo nivel
const postsDir = path.join(__dirname, "..", "frontend", "public", "assets", "posts");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "..", "frontend", "public", "assets")));

app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/users", usersRoutes);  // Monta las rutas de usuarios

app.get("/", (req, res) => {
  res.send("API funcionando");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
