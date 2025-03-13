import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/apiUsers";
import axios from "axios"; // Assurez-vous d'importer axios
import "./Header.scss";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const DEFAULT_PROFILE_PIC = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;
  
  // États pour la barre de recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // 'all', 'tweets', 'users', 'hashtags'
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'week', 'month'
  const [popularityFilter, setPopularityFilter] = useState(false);
  const searchResultsRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // API URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Ferme les résultats si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log("Utilisateur récupéré :", currentUser);
    if (currentUser) {
      console.log("Photo de profil de l'utilisateur :", currentUser.profilePic);
    }
    setUser(currentUser);

    const startAutoLogout = () => {
      let timeout;

      const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.warn("🚨 Inactivité détectée : Déconnexion...");
          handleLogout();
        }, 300000); // 5 minutes
      };

      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      resetTimer();

      return () => {
        clearTimeout(timeout);
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
      };
    };

    const cleanup = startAutoLogout();
    return () => {
      cleanup();
    };
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
  };

  // Fonction pour gérer la recherche
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Annule le timeout précédent pour éviter de multiples requêtes
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.length >= 2) {
      setIsSearching(true);
      // Attendre que l'utilisateur arrête de taper
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 500);
    } else {
      setSearchResults(null);
      setShowResults(false);
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setShowResults(false);
  };

  // Fonction pour effectuer la recherche avec API réelle
  const performSearch = async (query) => {
    try {
      // Construire les paramètres de recherche
      const params = {
        q: query,
        type: searchType !== "all" ? searchType : undefined,
        dateFilter: dateFilter !== "all" ? dateFilter : undefined,
        sortByPopularity: popularityFilter || undefined
      };
      
      // Faire une requête API réelle
      const response = await axios.get(`${API_BASE_URL}/search`, { params });
      
      if (response.data) {
        setSearchResults(response.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      // En cas d'erreur, afficher une interface utilisateur appropriée
      setSearchResults({
        error: "Une erreur s'est produite lors de la recherche"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Fonction pour naviguer vers la page de résultats de recherche
  const navigateToSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams();
      queryParams.append("q", searchQuery);
      queryParams.append("type", searchType);
      
      if (dateFilter !== "all") {
        queryParams.append("date", dateFilter);
      }
      
      if (popularityFilter) {
        queryParams.append("popular", "true");
      }
      
      // Naviguer vers la page de résultats de recherche
      navigate(`/search?${queryParams.toString()}`);
      setShowResults(false);
    }
  };

  return (
    <nav className="header">
      <div className="header-top">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-link">J-IPSSI.</Link>
        </div>

        {/* Barre de recherche mise à jour avec le nouveau style */}
        <div className="search-bar">
          <form onSubmit={navigateToSearch} className="search-form">
            <div className="search-input-container">
              <select
                className="search-type-select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">Tout</option>
                <option value="tweets">Tweets</option>
                <option value="users">Utilisateurs</option>
                <option value="hashtags">Hashtags</option>
              </select>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <i className="fa fa-search"></i>
              </button>
            </div>

            <div className="search-filters">
              <select
                className="date-filter-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Toutes dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
              <label className="popularity-filter">
                <input
                  type="checkbox"
                  checked={popularityFilter}
                  onChange={() => setPopularityFilter(!popularityFilter)}
                />
                <span>Les plus populaires</span>
              </label>
            </div>
          </form>
          
          {/* Résultats de recherche en temps réel */}
          {showResults && (
            <div className="search-results" ref={searchResultsRef}>
              {isSearching ? (
                <div className="searching">Recherche en cours...</div>
              ) : searchResults?.error ? (
                <div className="error-message">{searchResults.error}</div>
              ) : (
                <>
                  {/* Tweets */}
                  {searchResults?.tweets && searchResults.tweets.length > 0 && (
                    <div className="result-section">
                      <h4>Tweets</h4>
                      <ul>
                        {searchResults.tweets.slice(0, 3).map(tweet => (
                          <li key={`tweet-${tweet.id}`} className="result-item">
                            <Link to={`/tweet/${tweet.id}`}>
                              <span className="author">@{tweet.author}</span>
                              <p className="content">{tweet.content.substring(0, 50)}...</p>
                            </Link>
                          </li>
                        ))}
                        {searchResults.tweets.length > 3 && (
                          <li className="see-more">
                            <Link to={`/search?q=${searchQuery}&type=tweets`}>
                              Voir plus de tweets
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* Utilisateurs */}
                  {searchResults?.users && searchResults.users.length > 0 && (
                    <div className="result-section">
                      <h4>Utilisateurs</h4>
                      <ul>
                        {searchResults.users.slice(0, 3).map(user => (
                          <li key={`user-${user.id}`} className="result-item user-item">
                            <Link to={`/profile/${user.username}`}>
                              <img 
                                src={user.profilePic || DEFAULT_PROFILE_PIC} 
                                alt={user.username}
                                className="user-avatar-small"
                                onError={(e) => {e.target.src = DEFAULT_PROFILE_PIC}}
                              />
                              <div className="user-info-small">
                                <span className="username">@{user.username}</span>
                                <span className="followers">{user.followers || 0} followers</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                        {searchResults.users.length > 3 && (
                          <li className="see-more">
                            <Link to={`/search?q=${searchQuery}&type=users`}>
                              Voir plus d'utilisateurs
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* Hashtags */}
                  {searchResults?.hashtags && searchResults.hashtags.length > 0 && (
                    <div className="result-section">
                      <h4>Hashtags</h4>
                      <ul>
                        {searchResults.hashtags.slice(0, 4).map(hashtag => (
                          <li key={`hashtag-${hashtag.id || hashtag.name}`} className="result-item hashtag-item">
                            <Link to={`/hashtag/${hashtag.name.substring(1)}`}>
                              <span className="hashtag-name">{hashtag.name}</span>
                              <span className="hashtag-count">{hashtag.count || 0} posts</span>
                            </Link>
                          </li>
                        ))}
                        {searchResults.hashtags.length > 4 && (
                          <li className="see-more">
                            <Link to={`/search?q=${searchQuery}&type=hashtags`}>
                              Voir plus de hashtags
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* Aucun résultat */}
                  {(!searchResults?.tweets || searchResults.tweets.length === 0) &&
                   (!searchResults?.users || searchResults.users.length === 0) &&
                   (!searchResults?.hashtags || searchResults.hashtags.length === 0) && (
                    <div className="no-results">Aucun résultat trouvé pour "{searchQuery}"</div>
                  )}
                  
                  <div className="view-all-results">
                    <button onClick={navigateToSearch}>Voir tous les résultats</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Profil utilisateur */}
        {user ? (
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
              Disconnect
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Connexion</Link>
            <Link to="/register" className="register-btn">Inscription</Link>
          </div>
        )}
      </div>

      {/* Navigation centrée avec authentification */}
      <div className="nav-links">
        <Link to="/" className="nav-item">My Feed</Link>
        {user && <Link to="/myposts" className="nav-item">My Posts</Link>}
        {user && <Link to="/newpost" className="nav-item">New Post</Link>}
      </div>
    </nav>
  );
};

export default Header;
