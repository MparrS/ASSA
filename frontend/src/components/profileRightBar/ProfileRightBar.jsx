import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { DarkModeContext } from "../../context/darkModeContext.js";
import "./profileRightBar.scss";

const ProfileRightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) return;
    fetch(`http://localhost:3001/api/users/${currentUser.id}`)
      .then(r => r.json())
      .then(setInfo)
      .catch(console.error);
  }, [currentUser]);

  const user = info || currentUser;
  const esAdmin = user.rol === "admin";

  return (
    <div className={`profileRightBar ${darkMode ? "dark" : ""}`}>
      <div className="profileRightBarHeading">
        <span className="profileRightBarTitle">
          Información de {user.name || user.username}
        </span>
        <div className="actionButtons">
          <Link to={`/profile/${user.id}/edit`} className="editButton">
            Editar perfil
          </Link>
          {esAdmin && (
            <Link to="/admin" className="adminButton">
              Panel admin
            </Link>
          )}
        </div>
      </div>

      <div className="userInfoCard">
        <div className="userInfoRow">
          <div className="userImageContainer">
            <img
              src={
                user.profilePicture ||
                "/assets/profileCover/DefaultProfile.jpg"
              }
              alt={user.name}
              className="userImage"
            />
          </div>
          <div className="userTextInfo">
            <div className="userInfoHeader">
              <div className="userName">{user.name || user.username}</div>
              <div className="userRole">
                {(user.rol || "empleado").toUpperCase()}
              </div>
            </div>
            <div className="userDetails">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {user.phone || "–"}
              </p>
              <p>
                <strong>País:</strong> {user.country || "–"}
              </p>
              <p>
                <strong>Puntos:</strong> {user.points ?? 0}
              </p>
              <p>
                <strong>Dirección laboral:</strong>{" "}
                {user.direccionLaboral || "–"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRightBar;
