import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/apiUsers";
import "./Header.scss";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const DEFAULT_PROFILE_PIC = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;
  const DEFAULT_LOGO = `${process.env.PUBLIC_URL}/logo.jpg`; // Chemin par défaut

  useEffect(() => {
    // Débogage : Vérification du stockage local
    const localStorageUser = localStorage.getItem('user');
    console.log("Contenu de localStorage 'user':", localStorageUser);

    const currentUser = getCurrentUser();
    console.log("🔍 Utilisateur récupéré (détaillé):", JSON.stringify(currentUser, null, 2));
    
    if (currentUser) {
      console.log("✅ Détails utilisateur :", {
        username: currentUser.username,
        email: currentUser.email,
        profilePic: currentUser.profilePic
      });
      setUser(currentUser);
    } else {
      console.log("❌ Aucun utilisateur connecté");
      setUser(null);
    }

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
        {/* <div className="logo">
          <img 
            src={`${process.env.PUBLIC_URL}/Images/logo.jpg`} 
            alt="EmoTweet" 
            onError={(e) => {
              console.error("❌ Erreur de chargement du logo principal");
              e.target.src = DEFAULT_LOGO; // Logo de secours
            }}
          />
        </div> */}

        {/* Barre de recherche */}
        <div className="search-bar">
          <input type="text" placeholder="Rechercher..." />
          <button className="clear-btn">✖</button>
        </div>

        {/* Profil utilisateur */}
        {user && (
          <div className="user-info">
            <img
              src={user.profilePic || DEFAULT_PROFILE_PIC}
              alt="Profil"
              className="user-avatar"
              onError={(e) => {
                e.target.src = DEFAULT_PROFILE_PIC;
                console.error("⚠️ Erreur lors du chargement de l'image de profil, utilisation de l'image par défaut.");
              }}
            />
            <Link to="/settings" className="username-link">
              <span className="username">{user.username}</span>
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        )}
      </div>

      {/* Navigation centrée avec authentification */}
      <div className="nav-links">
        {/* Log pour déboguer l'état de l'utilisateur */}
        {console.log("🔍 État actuel de l'utilisateur:", user)}

        <Link to="/" className="nav-item">Mon Flux</Link>
        
        {/* Liens conditionnels */}
        {user ? (
          <>
            <Link to="/emotions" className="nav-item">Émotions</Link>
            <Link to="/myposts" className="nav-item">Mes Publications</Link>
            <Link to="/newpost" className="nav-item">Nouvelle Publication</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item login-btn">Connexion</Link>
            <Link to="/register" className="nav-item register-btn">Nouveau Compte</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;