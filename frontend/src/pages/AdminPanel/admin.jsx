import React from "react";
import './adminPanel.scss';

export default function AdminPanel() {
  return (
    <div className="admin-container">
      {/* Sidebar */}
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

      {/* Main */}
      <main className="admin-main">
        <div className="admin-buttons">
          <button>Volver</button>
          <button>Cerrar Sesión</button>
        </div>

        <div className="admin-card">
          <p><strong>Bienvenido, Mijail</strong></p>
          <p>Rol: ADMINISTRADOR</p>
          <p>Puntos: 0</p>
        </div>

        <div className="admin-card">
          <h3>Personas</h3>
          <button className="admin-button-blue">Ver Personas</button>
        </div>
      </main>
    </div>
  );
}
