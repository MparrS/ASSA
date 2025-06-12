import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../services/api";
import Logo from "../../assets/images/logo.png";
import LoginImg from "../../assets/images/login.jpg";
import "./login.scss";

const Login = () => {
  const [documento, setDocumento] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, loading, setCurrentUser } = useContext(AuthContext);

  // Redirigir solo si ya hay usuario cargado y autenticado
  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/');
    }
  }, [loading, currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post('/api/auth/login', {
        documento,
        contrasena,
      });

      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('rol', usuario.rol);
      setCurrentUser(usuario);

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img src={LoginImg} alt="Login" className="loginimg" />
          </Link>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <div className="bottom">
              <div className="navbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <img src={Logo} alt="Logo" className="navbarImg" />
                </Link>
              </div>

              <form onSubmit={handleLogin} className="bottomBox">
                <input
                  type="text"
                  placeholder="Número de documento"
                  id="documento"
                  className="loginInput"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  id="password"
                  className="loginInput"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />

                <button type="submit" className="loginButton">
                  Iniciar Sesión
                </button>

                {error && (
                  <span className="errorText">
                    {error}
                  </span>
                )}
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
