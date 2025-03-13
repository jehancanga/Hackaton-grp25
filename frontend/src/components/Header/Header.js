import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/apiUsers";
import "./Header.scss";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const DEFAULT_PROFILE_PIC = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;
  
  // États pour la barre de recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // 'all', 'tweets', 'users', 'hashtags'
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'week', 'month'
  const [popularityFilter, setPopularityFilter] = useState(false);
  const searchResultsRef = useRef(null);

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
      // Inchangé...
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
    
    if (query.length > 1) {
      performSearch(query);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Fonction pour effectuer la recherche (simulée, à remplacer par votre appel API réel)
  const performSearch = (query) => {
    // Exemple de simulation de recherche
    // À remplacer par votre appel à l'API de recherche
    
    // Exemple de données simulées pour la démonstration
    setTimeout(() => {
      const mockResults = {
        tweets: searchType === "all" || searchType === "tweets" ? 
          [
            { id: 1, text: `Tweet contenant ${query}`, user: "user1", date: "2023-11-25", likes: 15 },
            { id: 2, text: `Un autre tweet ${query}`, user: "user2", date: "2023-11-24", likes: 8 },
          ] : [],
        users: searchType === "all" || searchType === "users" ? 
          [
            { id: 101, username: `User_${query}`, followers: 120 },
            { id: 102, username: `${query}_fan`, followers: 45 },
          ] : [],
        hashtags: searchType === "all" || searchType === "hashtags" ? 
          [
            { id: 201, name: `#${query}`, count: 256 },
            { id: 202, name: `#trending${query}`, count: 189 },
          ] : [],
      };

      // Filtrer par date si nécessaire
      const filteredResults = filterByDate(mockResults);
      
      // Trier par popularité si l'option est activée
      const sortedResults = popularityFilter ? sortByPopularity(filteredResults) : filteredResults;
      
      setSearchResults(sortedResults);
    }, 300); // Délai simulé pour l'appel API
  };

  // Fonctions de filtrage et de tri
  const filterByDate = (results) => {
    if (dateFilter === "all") return results;

    const now = new Date();
    const filterDate = new Date();

    switch (dateFilter) {
      case "today":
        filterDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        filterDate.setDate(filterDate.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(filterDate.getMonth() - 1);
        break;
      default:
        return results;
    }

    // Filtrer les tweets par date
    const filteredTweets = results.tweets.filter(tweet => new Date(tweet.date) >= filterDate);
    return {
      ...results,
      tweets: filteredTweets,
    };
  };

  const sortByPopularity = (results) => {
    // Trier les tweets par nombre de likes
    const sortedTweets = [...results.tweets].sort((a, b) => b.likes - a.likes);
    // Trier les utilisateurs par nombre de followers
    const sortedUsers = [...results.users].sort((a, b) => b.followers - a.followers);
    // Trier les hashtags par nombre d'utilisations
    const sortedHashtags = [...results.hashtags].sort((a, b) => b.count - a.count);

    return {
      tweets: sortedTweets,
      users: sortedUsers,
      hashtags: sortedHashtags,
    };
  };

  // Fonction pour naviguer vers la page de résultats de recherche
  const navigateToSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}&type=${searchType}&date=${dateFilter}&popular=${popularityFilter}`);
      setShowResults(false);
    }
  };

  return (
    <nav className="header">
      <div className="header-top">
        {/* Logo */}
        <div className="logo">EmoTweet</div>

        {/* Barre de recherche améliorée */}
        <div className="search-bar">
          <form onSubmit={navigateToSearch}>
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
              />
              {searchQuery && (
                <button type="button" className="clear-btn" onClick={clearSearch}>
                  ✖
                </button>
              )}
              <button type="submit" className="search-btn">🔍</button>
            </div>

            <div className="search-filters">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Toutes dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  checked={popularityFilter}
                  onChange={() => setPopularityFilter(!popularityFilter)}
                />
                Les plus populaires
              </label>
            </div>
          </form>
          
          {/* Résultats de recherche en temps réel */}
          {showResults && searchResults && (
            <div className="search-results" ref={searchResultsRef}>
              {searchResults.tweets && searchResults.tweets.length > 0 && (
                <div className="result-section">
                  <h4>Tweets</h4>
                  <ul>
                    {searchResults.tweets.map(tweet => (
                      <li key={`tweet-${tweet.id}`} className="result-item">
                        <Link to={`/tweet/${tweet.id}`}>
                          {tweet.text.substring(0, 50)}... par @{tweet.user}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {searchResults.users && searchResults.users.length > 0 && (
                <div className="result-section">
                  <h4>Utilisateurs</h4>
                  <ul>
                    {searchResults.users.map(user => (
                      <li key={`user-${user.id}`} className="result-item">
                        <Link to={`/profile/${user.username}`}>
                          @{user.username} ({user.followers} followers)
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {searchResults.hashtags && searchResults.hashtags.length > 0 && (
                <div className="result-section">
                  <h4>Hashtags</h4>
                  <ul>
                    {searchResults.hashtags.map(hashtag => (
                      <li key={`hashtag-${hashtag.id}`} className="result-item">
                        <Link to={`/hashtag/${hashtag.name.substring(1)}`}>
                          {hashtag.name} ({hashtag.count} posts)
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(!searchResults.tweets || searchResults.tweets.length === 0) &&
               (!searchResults.users || searchResults.users.length === 0) &&
               (!searchResults.hashtags || searchResults.hashtags.length === 0) && (
                <div className="no-results">Aucun résultat trouvé</div>
              )}
              
              <div className="view-all-results">
                <button onClick={navigateToSearch}>Voir tous les résultats</button>
              </div>
            </div>
          )}
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
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Navigation centrée avec authentification */}
      <div className="nav-links">
        <Link to="/" className="nav-item">My Feed</Link>
        {user && <Link to="/myposts" className="nav-item">My Posts</Link>}
        {user && <Link to="/newpost" className="nav-item">New Post</Link>}
        
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
