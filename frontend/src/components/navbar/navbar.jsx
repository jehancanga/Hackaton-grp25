import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCog, FaEnvelope, FaSignInAlt, FaUserPlus, FaUnlock } from "react-icons/fa";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand fw-bold">
          <span className="logo-text">.IPSSI</span>
        </Link>

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
