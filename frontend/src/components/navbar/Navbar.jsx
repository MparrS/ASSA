import React from "react";
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
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import Logo from "./../../assets/images/logo2.png";

const Navbar = ({ setView }) => {
  const { currentUser } = useContext(AuthContext);

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
          <div className="navbarIconItem" onClick={() => setView("feed")}>
            <HomeIcon />
          </div>

          <div className="navbarIconItem">
            <StarOutlineIcon />
          </div>

          <div
            className="navbarIconItem"
            onClick={() => setView("rewards")}
          >
            <WalletIcon />
          </div>

          <div className="navbarIconItem">
            <DiscountIcon />
          </div>

          <div className="navbarIconItem">
            <PeopleAltIcon />
          </div>

          
        </div>
      </div>

      <div className="navbarRight">
        <div className="navbarLinks">
         
        </div>

        {currentUser && (
          <Link to={`/profile/${currentUser.username}`}>
            <img
              src={currentUser.profilePicture}
              alt={currentUser.name}
              className="navbarImg"
            />
          </Link>
        )}

        <div className="navbarIcons">
          <div className="navbarIconItem">
            <NotificationsIcon />
            <span className="navbarIconBadge">8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
