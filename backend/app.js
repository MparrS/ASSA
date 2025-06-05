const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Importa tus rutas y módulos del backend
const empleadosRoutes = require("./models/empleados");
const Usuario = require("./models/usuario");
const postsRoutes = require("./routes/postsRoutes");
const authRoutes = require("./routes/authRoutes");
const commentsRoutes = require("./routes/commentsRoutes");

// Definir la ruta absoluta para la carpeta de imágenes en el frontend
// Se asume que BACKEND y frontend están al mismo nivel
const postsDir = path.join(__dirname, "..", "frontend", "public", "assets", "posts");
console.log("Ruta de postsDir:", postsDir);

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
  console.log("Directorio creado:", postsDir);
} else {
  console.log("Directorio existe:", postsDir);
}

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta pública del frontend
// Entonces, los archivos que estén en "frontend/public/assets" se podrán acceder en: 
// http://localhost:3001/assets/posts/<filename>
app.use("/assets", express.static(path.join(__dirname, "..", "frontend", "public", "assets")));

app.use("/api/empleados", empleadosRoutes);
app.use("/api/usuario", Usuario);
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentsRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});