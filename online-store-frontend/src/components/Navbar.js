import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  let userName = '';
  if (token) {
    const decoded = jwtDecode(token);
    userName = decoded.name; // Asegúrate de que el backend incluya el campo "name" en el token
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/cart">Carrito</Link>
        </li>
        <li>
          <Link to="/invoices">Facturas</Link>
        </li>
        {!token ? (
          <>
            <li>
              <Link to="/register">Registro</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>Bienvenido, {userName}</li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
