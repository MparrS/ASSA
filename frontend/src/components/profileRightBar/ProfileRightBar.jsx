import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./profileRightBar.scss";

const ProfileRightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${currentUser.id}`);
        if (!res.ok) {
          throw new Error("Error en la red");
        }
        const data = await res.json();
        console.log("Datos del usuario:", data);
        setUserInfo(data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    if (currentUser && currentUser.id) {
      fetchUserInfo();
    }
  }, [currentUser]);

  const isAdmin =
    (userInfo?.rol === "admin") || (currentUser?.rol === "admin");

  return (
    <div className="profileRightBar">
      <div className="profileRightBarHeading">
        <span className="profileRightBarTitle">User Information</span>
        <div className="actionButtons">
          <Link to={`/profile/${currentUser.id}/edit`} style={{ textDecoration: "none" }}>
            <span className="editButton">Edit Profile</span>
          </Link>
          {isAdmin && (
            <Link to={`/admin`} style={{ textDecoration: "none" }}>
              <span className="adminButton">Admin Panel</span>
            </Link>
          )}
        </div>
      </div>

      <div className="userInfoCard">
        <div className="userInfoRow">
          <div className="userImageContainer">
            <img
              src={userInfo?.profilePicture || currentUser.profilePicture}
              alt="User Profile"
              className="userImage"
            />
          </div>
          <div className="userTextInfo">
            <div className="userInfoHeader">
              <div className="userName">
                {userInfo?.displayName || currentUser.displayName || "Usuario"}
              </div>
              <div className="userRole">
                {(userInfo?.rol || currentUser.rol || "N/A").toUpperCase()}
              </div>
            </div>
            <div className="userDetails">
              <p><strong>Email:</strong> {userInfo?.email || currentUser.email}</p>
              <p><strong>Phone:</strong> {userInfo?.phone || currentUser.phone}</p>
              <p><strong>Language:</strong> {userInfo?.language || currentUser.language}</p>
              <p><strong>Country:</strong> {userInfo?.country || currentUser.country}</p>
              <p><strong>Puntos:</strong> {userInfo?.puntos || currentUser.puntos || 0}</p>
              <p><strong>Dirección Laboral:</strong> {userInfo?.direccionLaboral || currentUser.direccionLaboral || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRightBar;
