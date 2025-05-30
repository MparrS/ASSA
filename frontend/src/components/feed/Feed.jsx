// Archivo: Feed.jsx
import React, { useState, useEffect } from 'react';
import Post from '../post/Post';
import Share from '../share/Share';
import './feed.scss';

const Feed = () => {
  // Estado para almacenar los posts obtenidos desde el backend
  const [posts, setPosts] = useState([]);

  // useEffect para obtener los posts cuando se monta el componente
  useEffect(() => {
    const obtenerPosts = async () => {
      try {
        // Se realiza la consulta al endpoint del backend (ajusta la URL si es necesario)
        const respuesta = await fetch('http://localhost:3001/api/posts');
        // Verificamos si la respuesta es exitosa
        const datos = await respuesta.json();
        setPosts(datos);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };

    obtenerPosts();
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* Componente que permite compartir nuevas publicaciones */}
        <Share />
        {/* Renderizamos los posts si se han obtenido, o un mensaje de aviso en caso contrario */}
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <p>No se encontraron publicaciones</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
