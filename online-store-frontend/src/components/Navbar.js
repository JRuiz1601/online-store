import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FiHome, FiShoppingCart, FiFileText, FiLogOut } from 'react-icons/fi';
import '../styles/Login.css';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  let userName = '';
  if (token) {
    const decoded = jwtDecode(token);
    userName = decoded.name;
  }

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Mi App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthRoute ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registro
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    <FiHome className="me-2" />
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <FiShoppingCart className="me-2" />
                    Carrito
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invoices">
                    <FiFileText className="me-2" />
                    Facturas
                  </Link>
                </li>
                {token ? (
                  <>
                    <li className="nav-item">
                      <span className="welcome-text">Bienvenido, {userName}</span>
                    </li>
                    <li className="nav-item">
                      <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut className="me-2" />
                        Cerrar Sesión
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">
                        Registro
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;