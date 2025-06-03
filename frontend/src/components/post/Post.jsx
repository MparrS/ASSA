import React, { useState, useContext } from "react";
import "./post.scss";
import { AuthContext } from "../../context/AuthContext";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);

  const userName = post.userName || "Sin nombre";
  const userUsername = post.userUsername || "usuarioDesconocido";
  const userProfilePicture = post.userProfilePicture || "/ruta/default.jpg";

  const postTitle = post.title || "";
  const postBody = post.body || "";
  const images = post.post_images || [];
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrevImage = () => {
    setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = async () => {
    const url = `http://localhost:3001/api/posts/${post.id}/${isLiked ? "unlike" : "like"}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? Math.max(prev - 1, 0) : prev + 1);
      }
    } catch (error) {
      console.error("Error al cambiar el estado del like:", error);
    }
  };

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    const currentTime = new Date().toLocaleString();

    const newComment = {
      postId: post.id,
      userId: currentUser.id,
      body: commentText,
      date: currentTime,
      likes: 0
    };

    try {
      const response = await fetch("http://localhost:3001/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      });

      if (!response.ok) throw new Error("Error al enviar el comentario");

      const data = await response.json();

      const commentToAdd = {
        id: data.commentId || Date.now(),
        ...newComment,
        name: currentUser.name,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture || "/ruta/default.jpg"
      };

      setComments(prev => [...prev, commentToAdd]);
      setCommentText("");
    } catch (error) {
      console.error("Error al insertar comentario:", error);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="post-header">
          <img className="profile-img" src={userProfilePicture} alt={userName} />
          <div className="author-info">
            <span className="name">{userName}</span>
            <span className="date">{post.date}</span>
          </div>
        </div>

        <div className="post-content">
          {postTitle && <h2 className="title">{postTitle}</h2>}
          {postBody && <p className="body">{postBody}</p>}
          {images.length > 0 && (
            <div className="post-images">
              {images.length > 1 && (
                <>
                  <button className="nav prev" onClick={handlePrevImage}>&lt;</button>
                  <button className="nav next" onClick={handleNextImage}>&gt;</button>
                </>
              )}
              <img className="carousel-img" src={images[currentImage]} alt={`Imagen ${currentImage + 1}`} />
            </div>
          )}
        </div>

        <div className="post-footer">
          <div className="actions">
            <div className="action" onClick={handleLike}>
              <span role="img" aria-label="like">👍</span> Me gusta
            </div>
            <div className="action" onClick={() => setShowComments(!showComments)}>
              <span role="img" aria-label="comment">💬</span> Comentario
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
                onChange={e => setCommentText(e.target.value)}
              />
              <button className="comment-button" onClick={handleCommentSubmit}>
                Publicar
              </button>
            </div>
            <div className="comment-list">
              {comments.map(comment => (
                <div className="comment" key={comment.id}>
                  <img
                    className="comment-profile"
                    src={comment.profilePicture || "/ruta/default.jpg"}
                    alt={comment.name}
                  />
                  <div className="comment-data">
                    <strong>{comment.name}</strong> (@{comment.username})
                    <p className="comment-body">{comment.body}</p>
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
