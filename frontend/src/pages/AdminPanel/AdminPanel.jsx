import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../../context/AuthContext";
import "./adminPanel.scss";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});

  // Obtiene la lista completa de usuarios
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users");
        if (!res.ok) {
          throw new Error("Error al obtener la lista de usuarios");
        }
        const data = await res.json();
        console.log("Lista de usuarios:", data);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

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

  // Inicia la edición de un usuario
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setFormData(user);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFormData({});
  };

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Envía la actualización al backend mediante PUT
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("Error actualizando el usuario");
      }
      const updatedUser = await res.json();
      // Actualiza la lista local de usuarios
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === editingUserId ? updatedUser : user))
      );
      setEditingUserId(null);
      setFormData({});
    } catch (err) {
      console.error("Error saving edit:", err);
    }
  };

  // Función para eliminar un usuario (requiere la implementación del endpoint DELETE en backend)
  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Error eliminando el usuario");
        }
        // Actualiza la lista local filtrando el usuario eliminado
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Error eliminando el usuario");
      }
    }
  };

  const userName = currentUser?.displayName || "Usuario";

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
          <button onClick={handleLogout}>Cerrar Sesi&oacute;n</button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <CircularProgress size={40} />
          </div>
        ) : (
          <>
            <div className="admin-card">
              <p><strong>Bienvenido, {userName}</strong></p>
              <p>Rol: {currentUser?.rol?.toUpperCase() || "N/A"}</p>
              <p>Puntos: {currentUser?.points || 0}</p>
            </div>

            <div className="admin-card">
              <h3>Usuarios</h3>
              <table className="usersTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Username</th>
                    <th>Documento</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Rol</th>
                    <th>Points</th>
                    <th>Direcci&oacute;n</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        {editingUserId === user.id ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <input
                            type="text"
                            name="username"
                            value={formData.username || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          user.username
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <input
                            type="text"
                            name="documento"
                            value={formData.documento || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          user.documento
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          user.phone
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <select
                            name="rol"
                            value={formData.rol || ""}
                            onChange={handleInputChange}
                          >
                            <option value="admin">Admin</option>
                            <option value="empleado">Empleado</option>
                          </select>
                        ) : (
                          user.rol
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <input
                            type="number"
                            name="points"
                            value={formData.points || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          user.points
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <input
                            type="text"
                            name="direccionLaboral"
                            value={formData.direccionLaboral || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          user.direccionLaboral || "N/A"
                        )}
                      </td>
                      <td>
                        {editingUserId === user.id ? (
                          <>
                            <button className="saveButton" onClick={handleSaveEdit}>Guardar</button>
                            <button className="cancelButton" onClick={handleCancelEdit}>Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button className="editButton" onClick={() => handleEditClick(user)}>Editar</button>
                            <button className="deleteButton" onClick={() => handleDelete(user.id)}>Eliminar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
