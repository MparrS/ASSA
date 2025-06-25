import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  MoreVert
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import "./post.scss";

const parseDate = ds => {
  const d = new Date(ds);
  return isNaN(d) ? new Date() : d;
};
const getRelativeTime = d => {
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff/1000),
        min = Math.floor(diff/60000),
        hrs = Math.floor(diff/3600000),
        days = Math.floor(diff/86400000);
  if (days>0) return `hace ${days} día${days>1?'s':''}`;
  if (hrs>0)  return `hace ${hrs} hora${hrs>1?'s':''}`;
  if (min>0)  return `hace ${min} minuto${min>1?'s':''}`;
  return `hace ${sec} segundo${sec>1?'s':''}`;
};
const isVideo = url => ["mp4","webm","mov","avi","mkv"]
  .includes(url.split(".").pop().toLowerCase());

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.rol === "admin";

  const mediaList = post.media?.map(m=>m.url) || post.post_images || [];
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i=>i===0?mediaList.length-1:i-1);
  const next = () => setIdx(i=>i===mediaList.length-1?0:i+1);

  // likes
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  useEffect(() => {
    if (!currentUser) return;
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/posts/${post.id}/isLiked?uid=${currentUser.id}`)
      .then(r=>r.json())
      .then(d=>setIsLiked(d.isLiked))
      .catch(console.error);
  }, [post.id, currentUser]);

  const toggleLike = async () => {
    if (!currentUser) return;
    const action = isLiked?"unlike":"like";
    const res = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/posts/${post.id}/${action}`,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ uid: currentUser.id })
      }
    );
    if (res.ok) {
      const { likes: cnt } = await res.json();
      setLikes(cnt);
      setIsLiked(!isLiked);
    }
  };

  // comentarios
  const [showC, setShowC] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [newC, setNewC] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchComments = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/comments?postId=${post.id}`
    );
    if (res.ok) {
      const { comments } = await res.json();
      setComments(comments);
    }
  };
  useEffect(() => {
    if (showC) fetchComments();
  }, [showC]);

  const publishComment = async () => {
    if (!newC.trim()||!currentUser) return;
    setLoading(true);
    await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/comments`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        postId: post.id,
        userId: currentUser.id,
        body: newC,
        date: new Date().toLocaleString(),
        likes: 0
      })
    });
    setNewC("");
    await fetchComments();
    setLoading(false);
  };

  // menú admin
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/posts/${post.id}`,
      { method: "DELETE" }
    );
    if (res.ok) window.location.reload();
    else alert("Error al eliminar");
  };

  const date = getRelativeTime(parseDate(post.date));

  return (
    <div className="post">
      <div className="postWrapper">

        {/* header */}
        <div className="post-header">
          <img className="profile-img"
               src={post.userProfilePicture}
               alt={post.userName}/>
          <div className="author-info">
            <span className="name">{post.userName}</span>
            <span className="post-date">{date}</span>
          </div>
          {isAdmin && (
            <div className="admin-menu" ref={menuRef}>
              <MoreVert
                className="more-icon"
                onClick={()=>setMenuOpen(o=>!o)}
              />
              {menuOpen && (
                <div className="menu-dropdown">
                  <div
                    className="menu-item delete"
                    onClick={handleDelete}
                  >
                    Eliminar publicación
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* contenido */}
        <div className="post-content">
          {post.title && <h2 className="title">{post.title}</h2>}
          {post.body && <p className="body">{post.body}</p>}
          {mediaList.length>0 && (
            <div className="post-images">
              {mediaList.length>1 && (
                <>
                  <button className="nav prev" onClick={prev}>&lt;</button>
                  <button className="nav next" onClick={next}>&gt;</button>
                </>
              )}
              {isVideo(mediaList[idx]) ? (
                <video
                  key={idx}
                  className="carousel-img"
                  src={mediaList[idx]}
                  controls
                />
              ) : (
                <img
                  key={idx}
                  className="carousel-img"
                  src={mediaList[idx]}
                  alt={`media-${idx}`}
                />
              )}
              <div className="image-counter">
                {idx+1} / {mediaList.length}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="post-footer">
          <div className="actions">
            <div className="action" onClick={toggleLike}>
              {isLiked
                ? <Favorite htmlColor="red"/>
                : <FavoriteBorder/> } Me gusta
            </div>
            <div className="action"
                 onClick={()=>setShowC(v=>!v)}>
              <ChatBubbleOutline/> Comentarios
            </div>
          </div>
          <div className="details">
            {likes} me gusta · {comments.length} comentarios
          </div>
        </div>

        {showC && (
          <div className="comments-section">
            {loading && (
              <div className="comment-loading">
                <CircularProgress size={24}/>
              </div>
            )}
            <div className="comment-input-row">
              <input
                className="comment-input"
                value={newC}
                onChange={e=>setNewC(e.target.value)}
                placeholder="Escribe un comentario..."
              />
              <button
                className="comment-button"
                onClick={publishComment}
              >Publicar</button>
            </div>
            <div className="comment-list">
              {comments.map(c=>(
                <div className="comment" key={c.id}>
                  <img className="comment-profile"
                       src={c.profilePicture}
                       alt={c.username}/>
                  <div className="comment-data">
                    <p className="comment-body">{c.body}</p>
                    <span className="comment-username">@{c.username}</span>
                    <span className="comment-date">{c.date}</span>
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
