import React, { useState } from "react";
import "./post.scss";
import {
  ChatBubbleOutline,
  MoreVert,
  Favorite,
  ThumbUp,
  ThumbUpAltOutlined,
  ShareOutlined,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Users } from "../../data";

const Post = ({ post }) => {
  const [current, setCurrent] = useState(0);
  const total = post.content?.length || 0;

  const [commentLikes, setCommentLikes] = useState(
    post.comments?.map((c) => parseInt(c.like)) || []
  );

  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1));

  const handleCommentLike = (index) => {
    const updated = [...commentLikes];
    updated[index] += 1;
    setCommentLikes(updated);
  };

  const renderMedia = (media) => {
    const isVideo = /\.(mp4|webm|ogg)$/i.test(media);
    return isVideo ? (
      <video controls className="carouselMedia">
        <source src={media} type="video/mp4" />
        Tu navegador no soporta video.
      </video>
    ) : (
      <img src={media} alt="" className="carouselMedia" />
    );
  };

  return (
    <div className="post">
      <div className="postWrapper">
        {/* --- Header --- */}
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${post.user.username}`}>
              <img
                src={post.user.profilePicture}
                alt={post.user.username}
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">@{post.user.username}</span>
            <span className="postDate">{post.date}</span>
          </div>
          <div className="postTopRight">
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </div>
        </div>

        {/* --- Body y Carrusel --- */}
        <div className="postCenter">
          <p className="postText">{post.body}</p>

          {total > 0 && (
            <div className="carouselContainer">
              <IconButton onClick={prev} className="arrow left">
                <ArrowBackIos fontSize="small" />
              </IconButton>

              <div className="carouselSlide">
                {renderMedia(post.content[current])}
              </div>

              <IconButton onClick={next} className="arrow right">
                <ArrowForwardIos fontSize="small" />
              </IconButton>

              <div className="dots">
                {post.content.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === current ? "active" : ""}`}
                    onClick={() => setCurrent(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- Footer botones --- */}
        <div className="postBottom">
          <div className="postBottomLeft">
            <Favorite style={{ color: "red" }} />
            <ThumbUp style={{ color: "#011631", marginLeft: 8 }} />
            <span className="postLikeCounter">{post.like}</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {post.comment} · comments · share
            </span>
          </div>
        </div>

        <hr className="footerHr" />

        <div className="postBottomFooter">
          <div className="postBottomFooterItem">
            <ThumbUpAltOutlined className="footerIcon" />
            <span className="footerText">Like</span>
          </div>
          <div className="postBottomFooterItem">
            <ChatBubbleOutline className="footerIcon" />
            <span className="footerText">Comment</span>
          </div>
          <div className="postBottomFooterItem">
            <ShareOutlined className="footerIcon" />
            <span className="footerText">Share</span>
          </div>
        </div>

        {post.comments?.length > 0 && (
          <div className="commentsSection">
            {post.comments.map((comment, index) => {
              const user = Users.find(u => u.id === comment.userId);
              return (
                <div key={comment.id} className="comment">
                  <img
                    src={user?.profilePicture}
                    alt={user?.username}
                    className="commentProfileImg"
                  />
                  <div className="commentContent">
                    <span className="commentUsername">@{user?.username}</span>
                    <span className="commentDate">{comment.date}</span>
                    <p className="commentBody">{comment.body}</p>
                    <div className="commentActions">
                      <button className="likeCommentButton">
                        👍 {comment.like}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Post;
