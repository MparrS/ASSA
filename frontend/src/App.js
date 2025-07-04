// App.js
import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import EditProfile from "./pages/editProfile/EditProfile";
import Profile from "./pages/profile/Profile";
import AdminPanel from "./pages/AdminPanel/AdminPanel";

import "./style/dark.scss";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const AuthRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: (
        <AuthRoute>
          <Home />
        </AuthRoute>
      ),
    },
    {
      path: "/space/:spaceId",
      element: (
        <AuthRoute>
          <Home />
        </AuthRoute>
      ),
    },
    {
      path: "/profile/:username",
      element: (
        <AuthRoute>
          <Profile />
        </AuthRoute>
      ),
    },
    {
      path: "/profile/:username/edit",
      element: (
        <AuthRoute>
          <EditProfile />
        </AuthRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <AuthRoute>
          <AdminPanel />
        </AuthRoute>
      ),
    },
  ]);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
