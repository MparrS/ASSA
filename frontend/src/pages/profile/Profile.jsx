import React, { useContext } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./profile.scss";
import Rightbar from "../../components/rightbar/Rightbar";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="profile">
      <Navbar />
      <div className="profileWrapper">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileInfo">
              <h4 className="profileInfoName">
                {currentUser.displayName}
              </h4>
            </div>
          </div>
          <div className="profileRightBottom">
            <Rightbar profile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
