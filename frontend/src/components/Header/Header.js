// src/components/Header/Header.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/api";
import "./Header.scss";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="header">
      <div className="header-top">
        {/* Logo */}
        <div className="logo">.IPSSI</div>

        {/* Barre de recherche */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button className="clear-btn">✖</button>
        </div>

        {/* Authentification */}
        <div className="auth-buttons">
          {user ? (
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          ) : (
            <>
              <Link to="/login" className="login-btn">Se connecter</Link>
              <Link to="/register" className="register-btn">Créer un compte</Link>
            </>
          )}
        </div>
      </div>

      {/* Navigation centrée */}
      <div className="nav-links">
        <Link to="/" className="nav-item">My Feed</Link>
        <Link to="/myposts" className="nav-item">My Posts</Link>
        <Link to="/mypage" className="nav-item">My Page</Link>
      </div>
    </nav>
  );
};

export default Header;
