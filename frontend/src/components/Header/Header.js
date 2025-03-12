// src/components/Header/Header.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/api";
import "./Header.scss";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const DEFAULT_PROFILE_PIC =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX5BBn2NvVcHouuDLpiDfaGhztRETO7O12Cw&s";

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

        {/* Profil utilisateur affiché seulement si connecté */}
        {user && (
          <div className="user-info">
            <img
              src={user.profilePic || DEFAULT_PROFILE_PIC}
              alt="Profil"
              className="user-avatar"
            />
            <span className="username">{user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        )}
      </div>

      {/* Navigation centrée avec authentification */}
      <div className="nav-links">
        <Link to="/" className="nav-item">My Feed</Link>
        <Link to="/myposts" className="nav-item">My Posts</Link>
        <Link to="/mypage" className="nav-item">My Page</Link>

        {/* Lien vers la création d'un nouveau post */}
        {user && <Link to="/newpost" className="nav-item newpost-btn">Créer un post</Link>}

        {/* Authentification */}
        {!user && (
          <>
            <Link to="/login" className="nav-item login-btn">Se connecter</Link>
            <Link to="/register" className="nav-item register-btn">Créer un compte</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
