import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout();
    }
  };

  return (
    <div className="layout">
      <nav className="layout-navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            СистемаКонтроля
          </Link>

          <div className="navbar-nav">
            <Link to="/projects" className={`navbar-link ${isActive('/projects')}`}>
              Объекты
            </Link>

            <div className="navbar-user">
              <span className="navbar-user-name">
                {user?.first_name} {user?.last_name}
              </span>
              <button className="navbar-logout-btn" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="layout-content">{children}</div>
    </div>
  );
};

export default Layout;