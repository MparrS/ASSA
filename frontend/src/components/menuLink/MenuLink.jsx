import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./menuLink.scss";
import { AuthContext } from "../../context/AuthContext";

const MenuLink = ({ Icon, text }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    console.log("Cerrando sesión, espere un momento...");
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    // Actualizar contexto para reflejar que no hay usuario
    setCurrentUser(null);

    console.log("Redirigiendo a /Login...");
    navigate("/Login"); // Redirigir al login
  };

  const handleClick = () => {
    if (text === "Logout") {
      cerrarSesion();
    }
  };

  return (
    <div className="menuLink" onClick={handleClick} style={{ cursor: "pointer" }}>
      {Icon}
      <span className="menuLinkText">{text}</span>
      {text === "Logout" && currentUser?.displayName && (
        <span className="menuLinkTextName">({currentUser.displayName})</span>
      )}
    </div>
  );
};

export default MenuLink;
