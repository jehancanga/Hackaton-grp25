import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaUser, FaCog, FaEnvelope, FaSignInAlt, FaUserPlus, FaUnlock } from "react-icons/fa";
import "./Navbar.css"; 
import { FaBell, FaHeart, FaComment, FaUserTag } from 'react-icons/fa';
import { motion } from 'framer-motion';


const notificationsData = [
    { id: 1, type: 'like', message: 'Alice a aimé votre post ❤️' },
    { id: 2, type: 'comment', message: 'Bob a commenté : "Super post !" 💬' },
    { id: 3, type: 'mention', message: 'Charlie vous a mentionné 📌' },
  ];


const Navbar = () => {

    const [showNotifications, setShowNotifications] = useState(false);


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
      <Link to="/" className="logo">Mon Feed</Link>
        

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/messaging" className="nav-link">
                <FaEnvelope className="me-2" /> Messagerie
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/trending" className="nav-link">
                🔥 Tendances
              </Link>
            </li>
            <li className='nav-item'>
                {/* Icône de notifications */}
        <div className="notifications-container">
          <div className="bell-icon" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell size={24} />
            {notificationsData.length > 0 && (
              <span className="notification-count">{notificationsData.length}</span>
            )}
          </div>

          {/* Menu déroulant des notifications */}
          {showNotifications && (
            <motion.div 
              className="notification-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4>Notifications</h4>
              <ul>
                {notificationsData.map(notif => (
                  <li key={notif.id} className="notification-item">
                    {notif.type === 'like' && <FaHeart className="icon like" />}
                    {notif.type === 'comment' && <FaComment className="icon comment" />}
                    {notif.type === 'mention' && <FaUserTag className="icon mention" />}
                    <span>{notif.message}</span>
                  </li>
                ))}
              </ul>
              {notificationsData.length === 0 && <p>Aucune notification</p>}
            </motion.div>
          )}
        </div>


            </li>
          </ul>

          {/* User Menu */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle d-flex align-items-center"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://via.placeholder.com/40" // Remplace avec un vrai avatar
                  alt="Avatar"
                  className="rounded-circle me-2"
                  width="32"
                  height="32"
                />
                <span className="d-none d-md-inline">Mon Profil</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <Link to="/profile" className="dropdown-item">
                    <FaUser className="me-2" /> Profil
                  </Link>
                </li>
                <li>
                  <Link to="/notification" className="dropdown-item">
                    <FaUser className="me-2" /> Notifications
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="dropdown-item">
                    <FaCog className="me-2" /> Paramètres
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link to="/logout" className="dropdown-item text-danger">
                    🚪 Déconnexion
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Auth Buttons */}
          <ul className="navbar-nav ms-3">
            <li className="nav-item">
              <Link to="/login" className="btn btn-outline-light me-2">
                <FaSignInAlt className="me-1" /> Connexion
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="btn btn-light">
                <FaUserPlus className="me-1" /> Inscription
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
