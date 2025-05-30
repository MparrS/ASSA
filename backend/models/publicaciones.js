const db = require('../config/db');

async function obtenerPublicaciones() {
  const query = `
    SELECT 
      p.id, 
      p.titulo,
      p.contenido, 
      p.fecha_publicacion, 
      u.id AS usuario_id,
      u.nombre AS usuario_nombre, 
      u.imagen_perfil AS usuario_imagen,
      e.id AS espacio_id,
      e.nombre AS espacio_nombre
    FROM publicaciones p
    JOIN users u ON p.usuario_id = u.id
    JOIN espacios e ON p.espacio_id = e.id
    ORDER BY p.fecha_publicacion DESC
  `;
  const [rows] = await db.promise().query(query); // ✅ usamos .promise()
  return rows;
}

async function crearPublicacion({ usuario_id, espacio_id, titulo, contenido }) {
  const query = `
    INSERT INTO publicaciones (usuario_id, espacio_id, titulo, contenido)
    VALUES (?, ?, ?, ?)
  `;
  await db.promise().query(query, [usuario_id, espacio_id, titulo, contenido]); // ✅ usamos .promise()
}

module.exports = {
  obtenerPublicaciones,
  crearPublicacion,
};
