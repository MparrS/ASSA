import React from "react";
import "./online.scss";

const Online = ({ onlineuser }) => {
  if (!onlineuser) return null; // prevent rendering if user is undefined

  const profilePicture = onlineuser.profilePicture || "/assets/person/default.jpg";
  const username = onlineuser.username || "Usuario";

  return (
    <div className="online">
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <img
            src={profilePicture}
            alt={username}
            className="rightbarProfileImg"
          />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{username}</span>
      </li>
    </div>
  );
};

export default Online;
