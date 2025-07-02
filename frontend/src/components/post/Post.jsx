import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  MoreVert
} from "@mui/icons-material";
import {
  Menu,
  MenuItem,
  IconButton,
  CircularProgress
} from "@mui/material";
import "./post.scss";

const DEFAULT_PROFILE = "/assets/profileCover/DefaultProfile.jpg";

const parseDate = ds => {
  const d = new Date(ds);
  return isNaN(d) ? new Date() : d;
};
const getRelativeTime = d => {
  const diff = Date.now() - d.getTime();
  const sec  = Math.floor(diff/1000),
        min  = Math.floor(diff/60000),
        hrs  = Math.floor(diff/3600000),
        days = Math.floor(diff/86400000);
  if (days>0) return `hace ${days} día${days>1?'s':''}`;
  if (hrs>0)  return `hace ${hrs} hora${hrs>1?'s':''}`;
  if (min>0)  return `hace ${min} minuto${min>1?'s':''}`;
  return `hace ${sec} segundo${sec>1?'s':''}`;
};
const isVideo = url => 
  typeof url === "string" &&
  ["mp4","mov","avi","webm","mkv"]
    .includes(url.split(".").pop().toLowerCase());

export default function Post({ post }) {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.rol === "admin";
  let mediaList = [];
  if (Array.isArray(post.media)) {
    mediaList = post.media.map(m =>
      typeof m === "string" ? m : (m.url || "")
    ).filter(Boolean);
  } else if (typeof post.post_images === "string") {
    mediaList = post.post_images
      .split(",")
      .map(u=>u.trim())
      .filter(Boolean);
  } else if (Array.isArray(post.post_images)) {
    mediaList = post.post_images.filter(u => typeof u === "string");
  }

  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i=> i===0?mediaList.length-1:i-1);
  const next = () => setIdx(i=> i===mediaList.length-1?0:i+1);

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  useEffect(() => {
    if (!currentUser) return;
    fetch(
      `${process.env.REACT_APP_API_URL||"http://localhost:3001"}` +
      `/api/posts/${post.id}/isLiked?uid=${currentUser.id}`
    )
      .then(r=>r.json())
      .then(d=>setIsLiked(d.isLiked))
      .catch(console.error);
  }, [post.id, currentUser]);

  const toggleLike = async () => {
    if (!currentUser) return;
    const action = isLiked ? "unlike" : "like";
    const res = await fetch(
      `${process.env.REACT_APP_API_URL||"http://localhost:3001"}` +
      `/api/posts/${post.id}/${action}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ uid: currentUser.id })
      }
    );
    if (res.ok) {
      const { likes: cnt } = await res.json();
      setLikes(cnt);
      setIsLiked(!isLiked);
    }
  };
  const [showC, setShowC] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newC, setNewC] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchComments = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL||"http://localhost:3001"}` +
      `/api/comments?postId=${post.id}`
    );
    if (res.ok) {
      const { comments } = await res.json();
      setComments(comments);
    }
  };
  useEffect(() => { if (showC) fetchComments(); }, [showC]);
  const publishComment = async () => {
    if (!newC.trim() || !currentUser) return;
    setLoading(true);
    await fetch(
      `${process.env.REACT_APP_API_URL||"http://localhost:3001"}/api/comments`,
      {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          postId: post.id,
          userId: currentUser.id,
          body: newC,
          date: new Date().toISOString(),
          likes: 0
        })
      }
    );
    setNewC("");
    await fetchComments();
    setLoading(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu  = e => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  const handleDelete = async () => {
    closeMenu();
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL||"http://localhost:3001"}` +
      `/api/posts/${post.id}`,
      { method: "DELETE" }
    );
    if (res.ok) window.location.reload();
    else alert("Error al eliminar");
  };

  const date = getRelativeTime(parseDate(post.date));
  return (
    <div className="post">
      <div className="post-wrapper">

        {/* HEADER */}
        <div className="post-header">
          <img
            className="profile-img"
            src={post.userProfilePicture || DEFAULT_PROFILE}
            alt={post.userName}
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_PROFILE;
            }}
          />
          <div className="author-info">
            <span className="name">{post.userName}</span>
            {post.spaceName && (
              <span className="space-name">En: {post.spaceName}</span>
            )}
            <span className="post-date">{date}</span>
          </div>

          {isAdmin && (
            <>
              <IconButton onClick={openMenu} size="small">
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
                transformOrigin={{ vertical:"top",    horizontal:"right" }}
              >
                <MenuItem onClick={handleDelete} className="delete-item">
                  Eliminar publicación
                </MenuItem>
              </Menu>
            </>
          )}
        </div>

        {/* CONTENT */}
        <div className="post-content">
          {post.title && <h2 className="title">{post.title}</h2>}
          {post.body  && <p className="body">{post.body}</p>}
          {mediaList.length > 0 && (
            <div className="post-images">
              {mediaList.length > 1 && (
                <>
                  <button className="nav prev" onClick={prev}>&lt;</button>
                  <button className="nav next" onClick={next}>&gt;</button>
                </>
              )}
              {isVideo(mediaList[idx])
                ? <video className="carousel-img" src={mediaList[idx]} controls/>
                : <img className="carousel-img" src={mediaList[idx]} alt={`media-${idx}`}/>
              }
              <div className="image-counter">
                {idx+1} / {mediaList.length}
              </div>
            </div>
          )}
        </div>
        <div className="post-footer">
          <div className="actions">
            <div className="action" onClick={toggleLike}>
              {isLiked ? <Favorite htmlColor="red"/> : <FavoriteBorder/>} Me gusta
            </div>
            <div className="action" onClick={()=>setShowC(v=>!v)}>
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
              <button className="comment-button" onClick={publishComment}>
                Publicar
              </button>
            </div>
            <div className="comment-list">
              {comments.map(c=>(
                <div className="comment" key={c.id}>
                  <img
                    className="comment-profile"
                    src={c.profilePicture || DEFAULT_PROFILE}
                    alt={c.username}
                    onError={e=>{
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_PROFILE;
                    }}
                  />
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
}
