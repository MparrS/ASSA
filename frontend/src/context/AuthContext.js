import { createContext, useState } from "react";
import { Users } from "../data";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = Users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
