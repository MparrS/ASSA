// frontend/src/components/Share.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Close,
  EmojiEmotions,
  PermMedia,
  VideoCameraFront,
  ArrowBackIos,
  ArrowForwardIos
} from "@mui/icons-material";
import "./share.scss";
import { AuthContext } from "../../context/AuthContext";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import sendIcon from "../../assets/icon/send.png";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const carouselRef = useRef(null);

  // Carga info usuario
  useEffect(() => {
    if (!currentUser?.id) return;
    fetch(`http://localhost:3001/api/users/${currentUser.id}`)
      .then(r => r.json())
      .then(d => setUserInfo(d))
      .catch(console.error);
  }, [currentUser]);

  // Carga espacios
  useEffect(() => {
    fetch("http://localhost:3001/api/spaces")
      .then(r => r.json())
      .then(({ spaces }) => setSpaces(spaces))
      .catch(console.error);
  }, []);

  const userToDisplay = userInfo || currentUser;
  if (!userToDisplay) return null;

  // Publicar post
  const handlePost = async () => {
    if (!selectedSpace) return alert("Selecciona un espacio");
    const formData = new FormData();
    formData.append("uid", userToDisplay.id);
    formData.append("displayName", userToDisplay.name);
    formData.append("content", input);
    formData.append("spaceId", selectedSpace);
    files.forEach(f => formData.append("image", f));

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Error al publicar");
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const handleKey = e => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  const addEmoji = e => {
    const codePoints = e.unified.split("-").map(u => "0x" + u);
    setInput(i => i + String.fromCodePoint(...codePoints));
  };

  const removeImage = i =>
    setFiles(f => f.filter((_, idx) => idx !== i));
  const scrollBy = dx =>
    carouselRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div className="share">
      <div className="shareWrapper">
        {/* Top: perfil + textarea */}
        <div className="shareTop">
          <img
            src={userToDisplay.profilePicture}
            alt={userToDisplay.name}
            className="shareProfileImg"
          />
          <textarea
            rows={2}
            placeholder={`¿Qué tienes en mente, ${userToDisplay.name}?`}
            value={input}
            className="shareInput"
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <hr className="shareHr" />

        {/* Preview imágenes */}
        {files.length > 0 && (
          <div className="shareImgCarouselWrapper">
            <ArrowBackIos
              className="carouselArrow leftArrow"
              onClick={() => scrollBy(-200)}
            />
            <div className="shareImgCarousel" ref={carouselRef}>
              {files.map((f, idx) => (
                <div key={idx} className="shareImgPreview">
                  <img
                    src={URL.createObjectURL(f)}
                    alt="preview"
                    className="shareImg"
                  />
                  <Close
                    className="shareCancelImg"
                    onClick={() => removeImage(idx)}
                  />
                </div>
              ))}
            </div>
            <ArrowForwardIos
              className="carouselArrow rightArrow"
              onClick={() => scrollBy(200)}
            />
          </div>
        )}

        {/* Bottom: opciones + botón + dropdown espacios */}
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <VideoCameraFront className="shareIcon" style={{ color: "#bb0000f2" }} />
              <span className="shareOptionText">Live Video</span>
            </div>
            <label htmlFor="file" className="shareOption">
              <PermMedia className="shareIcon" style={{ color: "#2e0196f1" }} />
              <span className="shareOptionText">Photo/Video</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpg,.jpeg"
                multiple
                style={{ display: "none" }}
                onChange={e => setFiles(Array.from(e.target.files))}
              />
            </label>
            <div
              className="shareOption"
              onClick={() => setShowEmojis(v => !v)}
            >
              <EmojiEmotions className="shareIcon" style={{ color: "#bfc600ec" }} />
              <span className="shareOptionText">Feelings/Activity</span>
            </div>
            {/* ▼ Dropdown de espacios ▼ */}
            <div className="shareOption spaceSelect">
              <select
                value={selectedSpace}
                onChange={e => setSelectedSpace(e.target.value)}
              >
                <option value="">-- Elige un espacio --</option>
                {spaces.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="shareButton" onClick={handlePost}>
            <img src={sendIcon} alt="send" className="sendIcon" />
          </button>
        </div>

        {/* Emoji picker */}
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
