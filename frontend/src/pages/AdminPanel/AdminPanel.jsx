import React, { useState, useEffect, useContext } from "react";
import { useNavigate }                          from "react-router-dom";
import CircularProgress                         from "@mui/material/CircularProgress";
import { Edit, Delete, LockReset, Lock, Search, Close } from "@mui/icons-material";
import { AuthContext }                          from "../../context/AuthContext";
import "./adminPanel.scss";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);

  const [view, setView]             = useState("dashboard");
  const [loading, setLoading]       = useState(true);
  const [users, setUsers]           = useState([]);
  const [spaces, setSpaces]         = useState([]);
  const [editingUserId, setEditId]  = useState(null);
  const [formData, setFormData]     = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser]       = useState({
    name: "", username: "", documento: "", email: "",
    phone: "", country: "", rol: "empleado", points: 0,
    direccionLaboral: ""
  });
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdUserId, setPwdUserId]   = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [createError, setCreateError] = useState("");

  const fetchUsers = async () => {
    const res = await fetch(`${API}/api/users`);
    if (res.ok) setUsers(await res.json());
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchUsers();
        const sRes  = await fetch(`${API}/api/spaces`);
        const sJson = await sRes.json();
        setSpaces(sJson.spaces || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    logout?.() ?? localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditClick = u => {
    setEditId(u.id);
    setFormData({ ...u });
  };
  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({});
  };
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };
  const handleSaveEdit = async () => {
    const res = await fetch(`${API}/api/users/${editingUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(u => u.map(x => x.id === updated.id ? updated : x));
      handleCancelEdit();
      alert("Usuario actualizado");
    }
  };
  const handleDeleteUser = async id => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    await fetch(`${API}/api/users/${id}`, { method: "DELETE" });
    setUsers(u => u.filter(x => x.id !== id));
  };

  const handleNewUserChange = e => {
    const { name, value } = e.target;
    setNewUser(n => ({ ...n, [name]: value }));
  };
  const handleCreateUser = async () => {
    setCreateError("");                
    const res = await fetch(`${API}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    const body = await res.json();
    if (res.ok) {
      setUsers(u => [...u, body]);
      setShowCreateModal(false);
      alert("Usuario creado");
    } else {
      // aquí mostramos POR QUÉ falló
      setCreateError(body.error || "Error desconocido al crear usuario");
    }
  };

  const resetPassword = async id => {
    if (!window.confirm("¿Resetear al documento?")) return;
    const res = await fetch(`${API}/api/users/${id}/reset-password`, { method: "POST" });
    if (res.ok) {
      alert("🔑 Contraseña reseteada");
      await fetchUsers();
    } else {
      alert("Error al resetear");
    }
  };

  const openPwdModal = id => {
    setPwdUserId(id);
    setNewPassword("");
    setShowPwdModal(true);
  };
  const changePassword = async () => {
    if (newPassword.length < 4) {
      alert("La contraseña debe tener mínimo 4 caracteres");
      return;
    }
    const res = await fetch(`${API}/api/users/${pwdUserId}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword })
    });
    if (res.ok) {
      alert("🔒 Contraseña actualizada");
      setShowPwdModal(false);
      await fetchUsers();
    } else {
      alert("Error al cambiar contraseña");
    }
  };

  const handleDeleteSpace = async id => {
    if (!window.confirm("¿Eliminar espacio?")) return;
    await fetch(`${API}/api/spaces/${id}`, { method: "DELETE" });
    setSpaces(s => s.filter(x => x.id !== id));
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading"><CircularProgress size={40} /></div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}>Inicio</button>
          <button className={view==="users"    ?"active":""} onClick={()=>setView("users")   }>Usuarios</button>
          <button className={view==="spaces"   ?"active":""} onClick={()=>setView("spaces")  }>Espacios</button>
        </nav>
      </aside>

      <div className="contentWrapper">
        <header className="admin-buttons">
          <button onClick={()=>navigate(-1)}>Volver</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </header>

        <section className="admin-card">
          <p><strong>Hola, {currentUser.username}</strong></p>
          <p>Rol: {currentUser.rol.toUpperCase()}</p>
        </section>

        {view==="dashboard" && (
          <section className="admin-card metrics">
            <div><h4>Total Usuarios</h4><p>{users.length}</p></div>
            <div><h4>Total Espacios</h4><p>{spaces.length}</p></div>
          </section>
        )}

        {view==="users" && (
          <section className="admin-card">
            <div className="users-header">
              <h3>Usuarios</h3>
            <button className="createUserBtn" onClick={()=>{
              setCreateError("");
              setShowCreateModal(true);
            }}>
              + Nuevo Usuario
            </button>
            </div>
            <div className="usersSearch">
              <Search className="searchIcon" />
              <input
                type="text"
                value={searchTerm}
                placeholder="Busqueda por documento, nombre y username"
                onChange={e => setSearchTerm(e.target.value.toLowerCase())}
              />
              {searchTerm && (
                <Close
                  className="clearIcon"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
            <table className="usersTable">
              <thead>
                <tr>
                  <th>Nombre</th><th>Username</th><th>Documento</th>
                  <th>Email</th><th>Phone</th><th>Rol</th><th>Points</th>
                  <th>Dirección</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u =>
                    u.name?.toLowerCase().includes(searchTerm) ||
                    u.username?.toLowerCase().includes(searchTerm) ||
                    u.documento?.toString().includes(searchTerm)
                  )
                  .map(u => (
                  <tr key={u.id}>
                    <td>{editingUserId===u.id
                      ? <input name="name" value={formData.name} onChange={handleInputChange}/>
                      : u.name}
                    </td>
                    <td>{editingUserId===u.id
                      ? <input name="username" value={formData.username} onChange={handleInputChange}/>
                      : u.username}
                    </td>
                    <td>{editingUserId===u.id
                      ? <input name="documento" value={formData.documento} onChange={handleInputChange}/>
                      : u.documento}
                    </td>
                    <td>{editingUserId===u.id
                      ? <input name="email" value={formData.email} onChange={handleInputChange}/>
                      : u.email}
                    </td>
                    <td>{editingUserId===u.id
                      ? <input name="phone" value={formData.phone} onChange={handleInputChange}/>
                      : u.phone}
                    </td>
                    <td>{editingUserId===u.id
                      ? <select name="rol" value={formData.rol} onChange={handleInputChange}>
                          <option value="admin">Admin</option>
                          <option value="empleado">Empleado</option>
                        </select>
                      : u.rol}
                    </td>
                    <td>{editingUserId===u.id
                      ? <input name="points" type="number" value={formData.points} onChange={handleInputChange}/>
                      : u.points}
                    </td>
                    <td>{editingUserId===u.id
                      ? <input name="direccionLaboral" value={formData.direccionLaboral} onChange={handleInputChange}/>
                      : u.direccionLaboral}
                    </td>
                    <td className="actions-cell">
                      {editingUserId===u.id ? (
                        <div className="action-group edit-mode">
                          <button className="saveBtn" onClick={handleSaveEdit}>Guardar</button>
                          <button className="cancelBtn" onClick={handleCancelEdit}>Cancelar</button>
                        </div>
                      ) : (
                        <div className="action-group normal-mode">
                          <button className="actionBtn editBtn"      onClick={()=>handleEditClick(u)}><Edit fontSize="small"/></button>
                          <button className="actionBtn deleteBtn"    onClick={()=>handleDeleteUser(u.id)}><Delete fontSize="small"/></button>
                          <button className="actionBtn resetBtn"     onClick={()=>resetPassword(u.id)}><LockReset fontSize="small"/></button>
                          <button className="actionBtn changePwdBtn" onClick={()=>openPwdModal(u.id)}><Lock fontSize="small"/></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {view==="spaces" && (
          <section className="admin-card">
            <h3>Espacios</h3>
            <table className="usersTable">
              <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
              <tbody>
                {spaces.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td><td>{s.name}</td>
                    <td className="actions-cell">
                      <button className="actionBtn deleteBtn" onClick={()=>handleDeleteSpace(s.id)}>
                        <Delete fontSize="small"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {showCreateModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h3>Crear Usuario</h3>

              {createError && (
                <p className="errorMessage">{createError}</p>
              )}

              <div className="modalForm">
                {Object.entries(newUser).map(([k, v]) => (
                  <div className="modalField" key={k}>
                    <label>{k}</label>
                    {k === "rol" ? (
                      <select name={k} value={v} onChange={handleNewUserChange}>
                        <option value="admin">Admin</option>
                        <option value="empleado">Empleado</option>
                      </select>
                    ) : (
                      <input
                        name={k}
                        value={v}
                        onChange={handleNewUserChange}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="modalActions">
                <button className="saveBtn" onClick={handleCreateUser}>
                  Crear
                </button>
                <button
                  className="cancelBtn"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {showPwdModal && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h3>Cambiar Contraseña</h3>
              <div className="modalForm">
                <div className="modalField">
                  <label>Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e=>setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="modalActions">
                <button className="saveBtn" onClick={changePassword}>Guardar</button>
                <button className="cancelBtn" onClick={()=>setShowPwdModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
