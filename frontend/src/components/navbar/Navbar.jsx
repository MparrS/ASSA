import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WalletIcon from '@mui/icons-material/Wallet';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import DiscountIcon from '@mui/icons-material/Discount';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Link } from "react-router-dom";
import "./navbar.scss";
import { AuthContext } from "./../../context/AuthContext";
import Logo from "./../../assets/images/logo2.png";

const Navbar = ({ setView }) => {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${currentUser.id}`);
        if (!res.ok) throw new Error("Error al obtener datos del usuario");
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Error al cargar información del usuario:", err);
      }
    };

    if (currentUser?.id) {
      fetchUserInfo();
    }
  }, [currentUser]);

  const userToDisplay = userInfo || currentUser;

  return (
    <div className="navbarContainer">
      <div className="navbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={Logo} alt="" className="navbarImg" />
        </Link>
      </div>

      <div className="navbarCenter" />

      <div className="navbarRight">
        <div className="navbarIcons">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="navbarIconItem" onClick={() => setView("feed")}>
            <HomeIcon />
          </div>
          </Link>
        
          <div className="navbarIconItem"><StarOutlineIcon /></div>
          <div className="navbarIconItem" onClick={() => setView("rewards")}>
            <WalletIcon />
          </div>
          <div className="navbarIconItem"><DiscountIcon /></div>
          <div className="navbarIconItem"><PeopleAltIcon /></div>
        </div>
      </div>

      <div className="navbarRight">
        {userToDisplay && (
          <Link to={`/profile/${userToDisplay.username}`}>
            <img
              src={userToDisplay.profilePicture}
              alt={userToDisplay.name || "user"}
              className="navbarImg"
            />
          </Link>
        )}
    {/*  <div className="navbarIcons">
          <div className="navbarIconItem">
            <NotificationsIcon />
            <span className="navbarIconBadge">8</span>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default Navbar;
