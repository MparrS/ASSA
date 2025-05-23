import React, { useContext } from "react";
import "./menuLink.scss";
import { AuthContext } from "../../context/AuthContext";
const MenuLink2 = ({ Icon, text, href }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="menuLink">
      <img src={Icon} alt="menu icon" className="menuIcon" />
      <span className="menuLinkText">{text}</span>
      <span className="menuLinkTextName">
        {text === "Logout" && `(${currentUser.displayName})`}
      </span>
    </a>
  );
};
export default MenuLink2;