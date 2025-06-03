import React, { useState, useContext, useEffect } from "react";
import "./post.scss";
import { AuthContext } from "../../context/AuthContext";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);

  // Datos del autor del post
  const userName = post.userName || "Sin nombre";
  const userProfilePicture = post.userProfilePicture || "/ruta/default.jpg";

  // Datos del post
  const postTitle = post.title || "";
  const postBody = post.body || "";
  const images = post.post_images || [];
  const [currentImage, setCurrentImage] = useState(0);

  // Funciones del carrusel
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Likes del post
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  // Comentarios
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  // Función para parsear la fecha en formato "día/mes/año, h:mm:ss p. m."
  const parsePostDate = (dateString) => {
    const parts = dateString.split(",");
    if (parts.length < 2) {
      return new Date(dateString);
    }
    const datePart = parts[0].trim();
    let timePart = parts[1].trim();

    timePart = timePart
      .replace("p. m.", "PM")
      .replace("a. m.", "AM")
      .replace("P.M.", "PM")
      .replace("A.M.", "AM");

    const dateParts = datePart.split("/");
    if (dateParts.length !== 3) {
      return new Date(dateString);
    }
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const timeRegex = /(\d+):(\d+):(\d+)\s*(AM|PM)/i;
    const match = timePart.match(timeRegex);
    if (!match) {
      return new Date(dateString);
    }
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const ampm = match[4].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    return new Date(year, month, day, hours, minutes, seconds);
  };

  // Función para devolver el tiempo transcurrido en formato relativo
  const getRelativeTime = (postDate) => {
    const now = new Date();
    const diff = now - postDate;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `hace ${days} día${days !== 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `hace ${hours} hora${hours !== 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    } else {
      return `hace ${seconds} segundo${seconds !== 1 ? "s" : ""}`;
    }
  };

  // Calcular tiempo relativo del post
  let relativeTimeText = "";
  if (post.date) {
    const pDate = parsePostDate(post.date);
    if (!isNaN(pDate.getTime())) {
      relativeTimeText = getRelativeTime(pDate);
    } else {
      relativeTimeText = post.date;
    }
  }

  // Obtener comentarios del backend
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${post.id}`);
      if (response.ok) {
        const data = await response.json();
        // Data.comments debe incluir username y profilePicture para cada comentario
        setComments(data.comments);
      } else {
        console.error("Error al obtener comentarios");
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  // Enviar comentario al backend
  const publishComment = async (newComment) => {
    try {
      const response = await fetch("http://localhost:3001/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment), 
      });
      if (!response.ok) {
        console.error("Error al publicar el comentario");
      } else {
        const { commentId } = await response.json();
        console.log("Comentario publicado con ID:", commentId);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
    }
  };

  // Publicar comentario usando currentUser
  const handlePublishComment = () => {
    if (commentText.trim() && currentUser) {
      const newComment = {
        postId: post.id,
        userId: currentUser.id,
        body: commentText,
        date: new Date().toLocaleString(),
        likes: 0,
        // Se usarán estos datos al insertar, pero en la respuesta se espera la info real del usuario
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
      };

      setComments([...comments, newComment]);
      setCommentText("");
      publishComment(newComment);
    } else {
      console.error("No se encontró el usuario actual o el comentario está vacío");
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="post-header">
          <img className="profile-img" src={userProfilePicture} alt={userName} />
          <div className="author-info">
            <span className="name">{userName}</span>
          </div>
        </div>

        <div className="post-content">
          {postTitle && <h2 className="title">{postTitle}</h2>}
          {post.date && <p className="post-date">{relativeTimeText}</p>}
          {postBody && <p className="body">{postBody}</p>}

          {images.length > 0 && (
            <div className="post-images">
              {images.length > 1 && (
                <>
                  <button className="nav prev" onClick={handlePrevImage}>
                    &lt;
                  </button>
                  <button className="nav next" onClick={handleNextImage}>
                    &gt;
                  </button>
                </>
              )}
              <img
                className="carousel-img"
                src={images[currentImage]}
                alt={`Imagen ${currentImage + 1}`}
              />
              <div className="image-counter">
                {currentImage + 1} / {images.length}
              </div>
            </div>
          )}
        </div>

        <div className="post-footer">
          <div className="actions">
            <div
              className="action"
              onClick={() => {
                setIsLiked(!isLiked);
                setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
              }}
            >
              <span role="img" aria-label="like">
                👍
              </span>{" "}
              Me gusta
            </div>
            <div
              className="action"
              onClick={() => setShowComments(!showComments)}
            >
              <span role="img" aria-label="comment">
                💬
              </span>{" "}
              Comentario
            </div>
          </div>
          <div className="details">
            {likeCount} me gusta · {comments.length} comentarios
          </div>
        </div>

        {showComments && (
          <div className="comments-section">
            <div className="comment-input-row">
              <input
                className="comment-input"
                type="text"
                placeholder="Escribe un comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="comment-button" onClick={handlePublishComment}>
                Publicar
              </button>
            </div>
            <div className="comment-list">
              {comments.map((comment, index) => (
                <div className="comment" key={index}>
                  <img
                    className="comment-profile"
                    src={comment.profilePicture || "/ruta/default.jpg"}
                    alt={comment.username}
                  />
                  <div className="comment-data">
                    <p className="comment-body">{comment.body}</p>
                    <span className="comment-username">@{comment.username}</span>
                    <div className="comment-date">{comment.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Post;
