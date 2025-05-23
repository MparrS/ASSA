import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import "./menuLink.scss";
import { AuthContext } from "./../../context/AuthContext";

const MenuLink = ({ Icon, text }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    console.log("Cerrando sesión, espere un momento...");
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    navigate('/Login');
  };

  const handleClick = () => {
    if (text === "Logout") {
      cerrarSesion();
    }
  };

  return (
    <div className="menuLink" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {Icon}
      <span className="menuLinkText">{text}</span>
      {text === "Logout" && currentUser?.displayName && (
        <span className="menuLinkTextName">({currentUser.displayName})</span>
      )}
    </div>
  );
};

export default MenuLink;
