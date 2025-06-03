import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./profileRightBar.scss";

const ProfileRightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Función para obtener la info del usuario desde el endpoint (MySQL)
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`/api/users/${currentUser.id}`);
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    if (currentUser && currentUser.id) {
      fetchUserInfo();
    }
  }, [currentUser]);

  // Mientras no se cargue la info, usamos los datos del currentUser
  return (
    <div className="profileRightBar">
      <div className="profileRightBarHeading">
        <span className="profileRightBarTitle">User Information</span>
        <Link to={`/profile/${currentUser.id}/edit`} style={{ textDecoration: "none" }}>
          <span className="editButton">Edit Profile</span>
        </Link>
      </div>

      <div className="profileRightBarInfo">
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Email: </span>
          <span className="profileRightBarInfoValue">
            { userInfo?.email || currentUser.email }
          </span>
        </div>
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Phone Number: </span>
          <span className="profileRightBarInfoValue">
            { userInfo?.phone || currentUser.phone }
          </span>
        </div>
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Language: </span>
          <span className="profileRightBarInfoValue">
            { userInfo?.language || currentUser.language }
          </span>
        </div>
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Country: </span>
          <span className="profileRightBarInfoValue">
            { userInfo?.country || currentUser.country }
          </span>
        </div>
      </div>

      <h4 className="profileRightBarTitle">Close Friends</h4>
      <div className="profileRightBarFollowings">
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend1.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Janet</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend2.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Isabella</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend3.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Beverly</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend4.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Glenna</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend5.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Alexis</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend6.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Kate</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileRightBar;
