// Feed.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.scss";

const Feed = () => {
  // Capturamos el parámetro spaceId de la URL, si está presente
  const { spaceId } = useParams();

  const [posts, setPosts] = useState([]);
  const [space, setSpace] = useState(null);

  // Obtener las publicaciones desde el backend
  useEffect(() => {
    const obtenerPosts = async () => {
      try {
        const respuesta = await fetch("http://localhost:3001/api/posts");
        const datos = await respuesta.json();

        // Filtramos las publicaciones si se envía un spaceId en la URL
        const filtrados = spaceId
          ? datos.filter((p) => p.spaceId === Number(spaceId))
          : datos;

        setPosts(filtrados);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };

    obtenerPosts();
  }, [spaceId]);

  // Obtener la información del espacio seleccionado
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
        {/* Si se obtuvo información del espacio, se muestra la cabecera */}
        {space && (
          <div className="spaceHeader">
            <img
              className="spaceCover"
              src={space.coverImage || "/defaultCover.jpg"}
              alt="Portada del espacio"
            />
            <div className="spaceInfo">
              <img
                className="spaceIcon"
                src={space.icon || "/defaultIcon.png"}
                alt="Ícono del espacio"
              />
              <div>
                <h2>{space.name}</h2>
                <p>{space.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Si no se está en un espacio específico se muestra el componente Share */}
        {!space && <Share />}

        {/* Renderizamos las publicaciones */}
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <center>
            <br />
            <br />
            <p>No se encontraron publicaciones</p>
          </center>
        )}
      </div>
    </div>
  );
};

export default Feed;
