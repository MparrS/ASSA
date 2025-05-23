import React, { useContext, useState } from "react";
import {
  Close,
  EmojiEmotions,
  PermMedia,
  VideoCameraFront,
} from "@mui/icons-material";
import "./share.scss";
import { AuthContext } from "../../context/AuthContext";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const Share = () => {
  const [input, setInput] = useState("");
  const [img, setImg] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handlePost = () => {
    if (!currentUser) return;

    const newPost = {
      id: Date.now(),
      uid: currentUser.id,
      photoURL: currentUser.profilePicture || "/assets/person/default.jpg",
      displayName: currentUser.name || "Usuario",
      content: input,
      image: img ? URL.createObjectURL(img) : null,
      createdAt: new Date().toISOString(),
    };

    console.log("New Post:", newPost); // Simulate saving the post
    // You can save it to localStorage or state if needed.

    setInput("");
    setImg(null);
    setShowEmojis(false);
  };

  const handleKey = (e) => {
    if (e.code === "Enter") handlePost();
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = sym.map((el) => "0x" + el);
    let emoji = String.fromCodePoint(...codesArray);
    setInput((prev) => prev + emoji);
  };

  const removeImage = () => setImg(null);

  if (!currentUser) return null;

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={currentUser.profilePicture || "/assets/person/default.jpg"}
            alt="profile"
            className="shareProfileImg"
          />
          <textarea
            rows={2}
            style={{ resize: "none", overflow: "hidden" }}
            placeholder={`What's on your mind ${currentUser.name || ""}?`}
            value={input}
            className="shareInput"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>
        <hr className="shareHr" />
        {img && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(img)} alt="" className="shareImg" />
            <Close className="shareCancelImg" onClick={removeImage} />
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
                style={{ display: "none" }}
                onChange={(e) => setImg(e.target.files[0])}
              />
            </label>
            <div onClick={() => setShowEmojis(!showEmojis)} className="shareOption">
              <EmojiEmotions className="shareIcon" style={{ color: "#bfc600ec" }} />
              <span className="shareOptionText">Feelings/Activity</span>
            </div>
          </div>
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
