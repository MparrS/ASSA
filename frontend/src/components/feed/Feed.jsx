import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.scss";

const Feed = () => {
  const { spaceId } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [space, setSpace] = useState(null);

  // Convierte URL de YouTube a formato embed
  const transformarYoutubeUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  // 1️⃣ Carga todos los posts, o solo los del espacio si spaceId está definido
  useEffect(() => {
    const obtenerPosts = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/posts");
        const datos = await res.json();
        const filtrados = spaceId
          ? datos.filter((p) => String(p.spaceId) === String(spaceId))
          : datos;
        setPosts(filtrados);
      } catch (err) {
        console.error("Error al obtener publicaciones:", err);
      }
    };
    obtenerPosts();
  }, [spaceId]);

  // 2️⃣ Si estamos en /space/:spaceId, carga también los datos del espacio
  useEffect(() => {
    const obtenerEspacio = async () => {
      if (!spaceId) {
        setSpace(null);
        return;
      }
      try {
        const res = await fetch(`http://localhost:3001/api/spaces/${spaceId}`);
        if (!res.ok) throw new Error("Espacio no encontrado");
        const datos = await res.json();
        setSpace(datos);
      } catch (err) {
        console.error("Error al obtener el espacio:", err);
        setSpace(null);
      }
    };
    obtenerEspacio();
  }, [spaceId]);

  // Comprueba si el usuario logueado es admin del espacio (para mostrar <Share />)
  const esAdminDelEspacio =
    space &&
    Array.isArray(space.admins) &&
    space.admins.some((admin) => admin.username === currentUser.username);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* 𝗘𝗻𝗰𝗮𝗯𝗲𝗿𝗮𝗱𝗼 𝗱𝗲𝗹 𝗲𝘀𝗽𝗮𝗰𝗶𝗼 */}
        {space && (
          <>
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

            {/* 𝗩𝗶𝗱𝗲𝗼 𝗲𝗺𝗯𝗲𝗯𝗶𝗱𝗼 (YouTube) */}
            {space.video_url && (
              <div className="spaceVideoContainer">
                <iframe
                  className="spaceVideo"
                  width="100%"
                  height="360"
                  src={transformarYoutubeUrl(space.video_url)}
                  title="Video del espacio"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </>
        )}

        {/* 𝗦𝗵𝗮𝗿𝗲 𝗲𝗻 𝗰𝗮𝘀𝗼 𝗱𝗲 𝗲𝘀𝗽𝗮𝗰𝗶𝗼 𝗼 𝗰𝗼𝗺𝗼 𝗮𝗱𝗺𝗶𝗻 */}
        {(!space || esAdminDelEspacio) && <Share />}

        {/* 𝗟𝗶𝘀𝘁𝗮 𝗱𝗲 𝗽𝗼𝘀𝘁𝘀 */}
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <center style={{ marginTop: 40 }}>
            <p>No se encontraron publicaciones</p>
          </center>
        )}
      </div>
    </div>
  );
};

export default Feed;
