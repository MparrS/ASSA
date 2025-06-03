import { createContext, useState, useEffect } from "react";
import API from "../pages/services/api"; // Asegúrate de que esta ruta sea correcta

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
        // Revisa en consola la estructura del usuario recibido
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

  const login = async (email, password) => {
    try {
      const response = await API.post("/api/auth/login", { email, password });
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
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
