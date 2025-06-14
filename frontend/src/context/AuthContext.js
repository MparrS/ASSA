import { createContext, useState, useEffect } from "react";
import API from "../pages/services/api";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const response = await API.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Usuario obtenido:", response.data.usuario);
        setCurrentUser(response.data.usuario);
      } catch (err) {
        console.error("Token inválido o expirado:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (documento, contrasena) => {
    try {
      const response = await API.post("/api/auth/login", { documento, contrasena });
      const { token, usuario } = response.data;
      localStorage.setItem("token", token);
      setCurrentUser(usuario);
      return true;
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
