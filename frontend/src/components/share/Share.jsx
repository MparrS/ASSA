import React, { useContext, useState, useRef } from "react";
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
  const [files, setFiles] = useState([]); // Para almacenar múltiples archivos adjuntos
  const [showEmojis, setShowEmojis] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const carouselRef = useRef(null);

  if (!currentUser) {
    console.error("No hay usuario actual definido");
    return null;
  }

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("uid", currentUser.id);
    formData.append("displayName", currentUser.name || "Usuario");
    formData.append("content", input);
    files.forEach(file => {
      formData.append("image", file);
    });

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Error al publicar el post");
      }
      const posted = await res.json();
      console.log("Post publicado:", posted);
      // Recargar la página después de publicar
      window.location.reload();
    } catch (error) {
      console.error("Error al publicar post:", error);
    }
    // Limpia los datos locales en caso de éxito o error
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
          {/* Aquí se utiliza la misma lógica para renderizar la imagen del usuario */}
          <img
            src={
              currentUser.profilePicture
                ? `${process.env.PUBLIC_URL}/assets/people/${currentUser.profilePicture}`
                : `${process.env.PUBLIC_URL}/assets/profileCover/DefaultProfile.jpg`
            }
            alt="profile"
            className="shareProfileImg"
          />
          <textarea
            rows={2}
            style={{ resize: "none", overflow: "hidden" }}
            placeholder={`¿Qué tienes en mente ${currentUser.name || ""}?`}
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
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="shareImg"
                  />
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
          {/* Botón de envío: se utiliza la imagen sendIcon */}
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
