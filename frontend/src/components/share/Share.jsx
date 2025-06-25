import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  PermMedia,
  EmojiEmotions,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { DarkModeContext } from "../../context/darkModeContext";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import sendIcon from "../../assets/icon/send.png";
import "./share.scss";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const { spaceId: routeSpaceId } = useParams();

  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(routeSpaceId || "");
  const [showEmojis, setShowEmojis] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const carouselRef = useRef();

  // 1) Carga datos de usuario
  useEffect(() => {
    if (!currentUser?.id) return;
    fetch(`http://localhost:3001/api/users/${currentUser.id}`)
      .then(r => r.json())
      .then(setUserInfo)
      .catch(console.error);
  }, [currentUser]);

  // 2) Carga espacios y auto‐selección
  useEffect(() => {
    fetch("http://localhost:3001/api/spaces")
      .then(r => r.json())
      .then(({ spaces }) => {
        setSpaces(spaces);
        if (routeSpaceId) return;
        const mine = spaces.find(s => s.userId === currentUser.id);
        if (mine) setSelectedSpace(mine.id);
      })
      .catch(console.error);
  }, [currentUser, routeSpaceId]);

  if (!currentUser || !userInfo) return null;
  const isAdmin = currentUser.rol === "admin";

  // 3) Publicar post
  const handlePost = async () => {
    if (!selectedSpace) return alert("Selecciona primero un espacio");
    const fd = new FormData();
    fd.append("uid", userInfo.id);
    fd.append("displayName", userInfo.name);
    fd.append("content", input);
    fd.append("spaceId", selectedSpace);
    files.forEach(f => fd.append("media", f));

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        body: fd
      });
      if (!res.ok) throw new Error("Error al publicar");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  // 4) Emoji
  const addEmoji = e => {
    const codes = e.unified.split("-").map(u => "0x" + u);
    setInput(i => i + String.fromCodePoint(...codes));
  };

  // 5) Archivos adjuntos
  const removeFile = idx =>
    setFiles(list => list.filter((_, i) => i !== idx));

  // 6) Render
  return (
    <div className={`share ${darkMode ? "dark" : ""}`}>
      <div className="shareWrapper">
        {/* Top */}
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={userInfo.profilePicture || "/assets/profileCover/DefaultProfile.jpg"}
            alt={userInfo.name}
          />
          <textarea
            className="shareInput"
            rows={2}
            placeholder={`¿Qué tienes en mente, ${userInfo.name}?`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePost();
              }
            }}
          />
        </div>
        <hr className="shareHr" />

        {/* Previsualización de medios */}
        {files.length > 0 && (
          <div className="mediaPreviewList">
            {files.map((f, i) => (
              <div key={i} className="mediaPreviewItem">
                {f.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(f)} alt="preview" />
                ) : (
                  <video src={URL.createObjectURL(f)} controls />
                )}
                <button
                  className="removeMedia"
                  onClick={() => removeFile(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div className="shareBottom">
          <div className="shareOptions">
            {/* Adjuntar media */}
            <label htmlFor="file" className="shareOption">
              <PermMedia style={{ color: "#2e0196f1" }} />
              <span>Imagen/Video</span>
              <input
                type="file"
                id="file"
                multiple
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={e => setFiles(Array.from(e.target.files))}
              />
            </label>

            {/* Emoji */}
            <div
              className="shareOption"
              onClick={() => setShowEmojis(v => !v)}
            >
              <EmojiEmotions style={{ color: "#bfc600ec" }} />
              <span>Emoji</span>
            </div>

            {/* Selector visual de espacios */}
            {!routeSpaceId && (
              <div className="spaceSelectWrapper">
                <label>Publicar en:</label>
                <div className="spaceList">
                  {spaces.map(s => (
                    <div
                      key={s.id}
                      className={
                        "spaceItem" +
                        (selectedSpace === s.id ? " selected" : "")
                      }
                      onClick={() => setSelectedSpace(s.id)}
                    >
                      {s.icon ? (
                        <img src={s.icon} alt={s.name} />
                      ) : (
                        <span className="fallbackIcon">📁</span>
                      )}
                      <span>{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="shareButton" onClick={handlePost}>
            <img src={sendIcon} alt="send" className="sendIcon" />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojis && (
          <div className="emoji">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Share;
