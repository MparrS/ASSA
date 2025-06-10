import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../post/Post';
import Share from '../share/Share';
import './feed.scss';

const Feed = () => {
  const { spaceId } = useParams(); // obtiene spaceId desde la URL si existe

  const [posts, setPosts] = useState([]);
  const [space, setSpace] = useState(null);

  // Obtener los posts desde el backend
  useEffect(() => {
    const obtenerPosts = async () => {
      try {
        const respuesta = await fetch('http://localhost:3001/api/posts');
        const datos = await respuesta.json();

        // Filtrar si hay spaceId activo
        const filtrados = spaceId
          ? datos.filter((p) => p.spaceId === spaceId)
          : datos;

        setPosts(filtrados);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };

    obtenerPosts();
  }, [spaceId]);

  // Obtener los detalles del espacio
  useEffect(() => {
    const obtenerEspacio = async () => {
      if (!spaceId) {
        setSpace(null);
        return;
      }

      try {
        const respuesta = await fetch(`http://localhost:3001/api/spaces/${spaceId}`);
        const datos = await respuesta.json();
        setSpace(datos);
      } catch (error) {
        console.error("Error al obtener el espacio:", error);
      }
    };

    obtenerEspacio();
  }, [spaceId]);

  return (
    <div className="feed">
      <div className="feedWrapper">

        {/* Mostrar portada del espacio si estamos dentro de uno */}
        {space && (
          <div className="spaceHeader">
            <img className="spaceCover" src={space.coverImage} alt="Portada del espacio" />
            <div className="spaceInfo">
              <img className="spaceIcon" src={space.icon} alt="Ícono del espacio" />
              <div>
                <h2>{space.name}</h2>
                <p>{space.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar formulario para publicar (puedes validar si es admin aquí) */}
        {!space && <Share />}

        {/* Renderizar posts */}
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <center><br /><br /><p>No se encontraron publicaciones</p></center>
        )}
      </div>
    </div>
  );
};

export default Feed;
