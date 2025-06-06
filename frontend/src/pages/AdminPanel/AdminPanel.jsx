import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../../context/AuthContext";
import "./adminPanel.scss";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        // Ajusta la URL según corresponda
        const res = await fetch(`http://localhost:3001/api/users/${currentUser.id}`);
        if (!res.ok) {
          throw new Error("Error al obtener la información de usuario");
        }
        const data = await res.json();
        console.log("Datos del usuario:", data);
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.id) {
      fetchAdminInfo();
    }
  }, [currentUser]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
    }
    navigate("/login");
  };

  const userName =
    (userData && userData.displayName) || currentUser.displayName || "Usuario";
  const isAdmin =
    (userData && userData.rol === "admin") ||
    (currentUser && currentUser.rol === "admin");

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>
        <nav className="admin-menu">
          <a href="#">Inicio</a>
          <details>
            <summary>Personas</summary>
          </details>
          <a href="#">Administrar Espacios</a>
          <a href="#">Administrar Yalepuntos</a>
          <a href="#">Administrar Premios</a>
          <a href="#">Administrar Redenciones</a>
          <a href="#">Administrar Accesos Directos</a>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-buttons">
          <button onClick={handleGoBack}>Volver</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <CircularProgress size={40} />
          </div>
        ) : (
          <div className="admin-card">
            <p>
              <strong>Bienvenido, {userName}</strong>
            </p>
            <p>Rol: {(userData?.rol || currentUser.rol || "N/A").toUpperCase()}</p>
            <p>Puntos: {userData?.puntos || 0}</p>
          </div>
        )}

        <div className="admin-card">
          <h3>Personas</h3>
          <button className="admin-button-blue">Ver Personas</button>
        </div>
      </main>
    </div>
  );
}
