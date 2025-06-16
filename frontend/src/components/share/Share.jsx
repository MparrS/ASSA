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
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${currentUser.id}`);
        if (!res.ok) throw new Error("Error al obtener datos del usuario");
        const data = await res.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      }
    };

    if (currentUser?.id) {
      fetchUserInfo();
    }
  }, [currentUser]);

  const userToDisplay = userInfo || currentUser;

  if (!userToDisplay) {
    return null;
  }

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("uid", userToDisplay.id);
    formData.append("displayName", userToDisplay.name || "Usuario");
    formData.append("content", input);
    files.forEach(file => {
      formData.append("image", file);
    });

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error al publicar el post");
      await res.json();
      window.location.reload();
    } catch (error) {
      console.error("Error al publicar post:", error);
    }

    setInput("");
    setFiles([]);
    setShowEmojis(false);
  };

  const handleKey = (e) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  const addEmoji = (e) => {
    const codes = e.unified.split("-").map(el => "0x" + el);
    const emoji = String.fromCodePoint(...codes);
    setInput(prev => prev + emoji);
  };

  const removeImage = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={userToDisplay.profilePicture}
            alt={userToDisplay.name}
            className="shareProfileImg"
          />
          <textarea
            rows={2}
            style={{ resize: "none", overflow: "hidden" }}
            placeholder={`¿Qué tienes en mente ${userToDisplay.name || ""}?`}
            value={input}
            className="shareInput"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>
        <hr className="shareHr" />
        {files.length > 0 && (
          <div className="shareImgCarouselWrapper">
            <ArrowBackIos className="carouselArrow leftArrow" onClick={scrollLeft} />
            <div className="shareImgCarousel" ref={carouselRef}>
              {files.map((file, index) => (
                <div key={index} className="shareImgPreview">
                  <img src={URL.createObjectURL(file)} alt="preview" className="shareImg" />
                  <Close className="shareCancelImg" onClick={() => removeImage(index)} />
                </div>
              ))}
            </div>
            <ArrowForwardIos className="carouselArrow rightArrow" onClick={scrollRight} />
          </div>
        )}
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
                accept=".png,.jpeg,.jpg"
                multiple
                style={{ display: "none" }}
                onChange={(e) => setFiles(Array.from(e.target.files))}
              />
            </label>
            <div onClick={() => setShowEmojis(!showEmojis)} className="shareOption">
              <EmojiEmotions className="shareIcon" style={{ color: "#bfc600ec" }} />
              <span className="shareOptionText">Feelings/Activity</span>
            </div>
          </div>
          <button className="shareButton" onClick={handlePost}>
            <img src={sendIcon} alt="send" className="sendIcon" />
          </button>
        </div>
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
