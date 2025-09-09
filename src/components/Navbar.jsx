import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { language, translate } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <i className="fas fa-ticket-alt"></i>
          City Pulse
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/">{translate('Home', 'الرئيسية')}</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile">{translate('Profile', 'الملف الشخصي')}</Link>
          </li>
          <li className="nav-item">
            <LanguageToggle />
          </li>
          {currentUser ? (
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-outline logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                {translate('Logout', 'تسجيل الخروج')}
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="btn btn-primary">
                <i className="fas fa-user"></i>
                {translate('Login', 'تسجيل الدخول')}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;