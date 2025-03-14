import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/apiUsers";
import { getAllTweets } from "../../services/apiPosts";
import "./Header.scss";
import { FaSearch, FaHashtag, FaUser, FaFeather } from "react-icons/fa";

const Header = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allTweets, setAllTweets] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  const DEFAULT_PROFILE_PIC = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;

  useEffect(() => {
    // Récupérer l'utilisateur actuel
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Charger tous les tweets pour la recherche
    const fetchTweets = async () => {
      try {
        const tweets = await getAllTweets();
        if (tweets) {
          setAllTweets(tweets);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tweets:", error);
      }
    };
    
    fetchTweets();

    // Configuration de l'auto-déconnexion
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

    // Gestion des clics en dehors de la barre de recherche
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    const cleanup = startAutoLogout();

    return () => {
      cleanup();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fonction de recherche
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = {
      users: [],
      hashtags: [],
      tweets: []
    };

    // Recherche par nom d'utilisateur
    if (allTweets.length > 0) {
      const userMap = new Map();
      
      allTweets.forEach(tweet => {
        if (tweet.userId && tweet.userId.username && 
            tweet.userId.username.toLowerCase().includes(term.toLowerCase())) {
          if (!userMap.has(tweet.userId._id)) {
            userMap.set(tweet.userId._id, tweet.userId);
          }
        }
      });
      
      results.users = Array.from(userMap.values());
    }

    // Recherche par hashtag
    const hashtagSet = new Set();
    allTweets.forEach(tweet => {
      if (tweet.hashtags && Array.isArray(tweet.hashtags)) {
        tweet.hashtags.forEach(tag => {
          if (tag.toLowerCase().includes(term.toLowerCase())) {
            hashtagSet.add(tag);
          }
        });
      }
    });
    results.hashtags = Array.from(hashtagSet);

    // Recherche par contenu du tweet
    results.tweets = allTweets.filter(tweet => 
      tweet.content && tweet.content.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5); // Limiter à 5 résultats pour éviter surcharge

    setSearchResults(results);
    setShowResults(true);
  };

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Navigation vers le profil d'un utilisateur
  const navigateToProfile = (userId) => {
    setShowResults(false);
    navigate(`/profile/${userId}`);
  };

  // Navigation vers les tweets avec un hashtag
  const navigateToHashtag = (hashtag) => {
    setShowResults(false);
    // Ici, vous pourriez implémenter une page spécifique pour les hashtags
    // Pour l'instant, nous allons juste afficher un message
    alert(`Recherche par hashtag: #${hashtag}`);
  };

  // Navigation vers un tweet spécifique
  const navigateToTweet = (tweetId) => {
    setShowResults(false);
    // Pour l'instant, nous allons juste afficher un message
    alert(`Affichage du tweet: ${tweetId}`);
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="header">
      <div className="header-top">
        {/* Logo texte */}
        <div className="logo-text">
          <FaFeather className="logo-icon" />
          <span>EmoTweet</span>
        </div>

        {/* Barre de recherche */}
        <div className="search-container" ref={searchRef}>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher utilisateurs, hashtags, tweets..." 
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => searchTerm.trim() !== "" && setShowResults(true)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={clearSearch}>✖</button>
            )}
          </div>
          
          {/* Résultats de recherche */}
          {showResults && (
            <div className="search-results">
              {/* Utilisateurs trouvés */}
              {searchResults.users && searchResults.users.length > 0 && (
                <div className="result-section">
                  <h4><FaUser /> Utilisateurs</h4>
                  <ul>
                    {searchResults.users.map(user => (
                      <li key={user._id} onClick={() => navigateToProfile(user._id)}>
                        <img 
                          src={user.profilePic || DEFAULT_PROFILE_PIC} 
                          alt={user.username}
                          className="search-avatar"
                        />
                        <span>{user.username}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Hashtags trouvés */}
              {searchResults.hashtags && searchResults.hashtags.length > 0 && (
                <div className="result-section">
                  <h4><FaHashtag /> Hashtags</h4>
                  <ul>
                    {searchResults.hashtags.map((tag, index) => (
                      <li key={index} onClick={() => navigateToHashtag(tag)}>
                        <FaHashtag className="hashtag-icon" />
                        <span>{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Tweets trouvés */}
              {searchResults.tweets && searchResults.tweets.length > 0 && (
                <div className="result-section">
                  <h4><FaFeather /> Tweets</h4>
                  <ul>
                    {searchResults.tweets.map(tweet => (
                      <li key={tweet._id} onClick={() => navigateToTweet(tweet._id)}>
                        <div className="tweet-result">
                          <p>{tweet.content.length > 60 
                            ? tweet.content.substring(0, 60) + "..." 
                            : tweet.content}
                          </p>
                          <span className="tweet-author">
                            par {tweet.userId.username}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Aucun résultat */}
              {(!searchResults.users || searchResults.users.length === 0) &&
               (!searchResults.hashtags || searchResults.hashtags.length === 0) &&
               (!searchResults.tweets || searchResults.tweets.length === 0) && (
                <div className="no-results">
                  Aucun résultat trouvé pour "{searchTerm}"
                </div>
              )}
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
        
        {/* Liens conditionnels */}
        {user ? (
          <>
            <Link to="/emotions" className="nav-item">My Feel Feed</Link>
            <Link to="/myposts" className="nav-item">My Publications</Link>
            <Link to="/newpost" className="nav-item">New Publication</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item login-btn">Connexion</Link>
            <Link to="/register" className="nav-item register-btn">New Compte</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;