import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/apiUsers";
import "./Header.scss";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const DEFAULT_PROFILE_PIC =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX5BBn2NvVcHouuDLpiDfaGhztRETO7O12Cw&s";

  useEffect(() => {
    setUser(getCurrentUser());
    
    const startAutoLogout = () => {
      let timeout;

      const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.warn("🚨 Inactivité détectée : Déconnexion...");
          handleLogout();
        }, 300000); // 5 minutes
      };

      // Ajouter les événements
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      resetTimer(); // Démarrer immédiatement

      return () => {
        clearTimeout(timeout);
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
      };
    };

    const cleanup = startAutoLogout();

    return () => {
      cleanup(); // Nettoyage propre lors du démontage du composant
    };
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
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

        {/* Profil utilisateur */}
        {user && (
          <div className="user-info">
            <img
              src={user.profilePic || DEFAULT_PROFILE_PIC}
              alt="Profil"
              className="user-avatar"
            />
            <Link to="/settings" className="username-link">
              <span className="username">{user.username}</span>
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Navigation centrée avec authentification */}
      <div className="nav-links">
        <Link to="/" className="nav-item">My Feed</Link>
        {user &&<Link to="/myposts" className="nav-item">My Posts</Link>}
        {user && <Link to="/newpost" className="nav-item">New Post</Link>}  {/* ✅ Ajout du lien "New Post" */}

        {/* Authentification */}
        {!user && (
          <>
            <Link to="/login" className="nav-item login-btn">Connexion</Link>
            <Link to="/register" className="nav-item register-btn">New Account</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
