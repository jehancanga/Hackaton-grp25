import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchResults.scss"; // Vous pouvez créer ce fichier pour les styles

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Extraire les paramètres de l'URL
  const initialQuery = queryParams.get("q") || "";
  const initialType = queryParams.get("type") || "all";
  const initialDate = queryParams.get("date") || "all";
  const initialPopular = queryParams.get("popular") === "true";
  
  // États
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [dateFilter, setDateFilter] = useState(initialDate);
  const [popularFilter, setPopularFilter] = useState(initialPopular);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
  const DEFAULT_PROFILE_PIC = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;

  // Charger les résultats au chargement de la page ou quand les paramètres changent
  useEffect(() => {
    fetchSearchResults();
  }, [location.search]);

  // Fonction pour récupérer les résultats
  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Construire les paramètres de recherche
      const params = {
        q: query,
        type: type !== "all" ? type : undefined,
        dateFilter: dateFilter !== "all" ? dateFilter : undefined,
        sortByPopularity: popularFilter || undefined
      };
      
      const response = await axios.get(`${API_BASE_URL}/search`, { params });
      
      if (response.data) {
        setResults(response.data);
      }
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      setError("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour les filtres et relancer la recherche
  const updateFilters = () => {
    const newParams = new URLSearchParams();
    newParams.append("q", query);
    newParams.append("type", type);
    
    if (dateFilter !== "all") {
      newParams.append("date", dateFilter);
    }
    
    if (popularFilter) {
      newParams.append("popular", "true");
    }
    
    navigate(`/search?${newParams.toString()}`);
  };

  // Gérer le changement de formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    updateFilters();
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Résultats de recherche pour "{query}"</h1>
        
        {/* Formulaire de filtrage */}
        <form onSubmit={handleSubmit} className="search-filters-form">
          <div className="search-input-row">
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Modifier la recherche..."
              className="search-input"
            />
            <button type="submit" className="search-button">Rechercher</button>
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <label>Type:</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">Tout</option>
                <option value="tweets">Tweets</option>
                <option value="users">Utilisateurs</option>
                <option value="hashtags">Hashtags</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Date:</label>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Toutes dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
            
            <div className="filter-group checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={popularFilter} 
                  onChange={(e) => setPopularFilter(e.target.checked)} 
                />
                Les plus populaires
              </label>
            </div>
            
            <button 
              type="button" 
              className="apply-filters-btn"
              onClick={updateFilters}
            >
              Appliquer les filtres
            </button>
          </div>
        </form>
        
        {/* Filtres actifs */}
        <div className="active-filters">
          <strong>Filtres actifs:</strong>
          <span className="filter-tag">Type: {type === "all" ? "Tout" : type === "tweets" ? "Tweets" : type === "users" ? "Utilisateurs" : "Hashtags"}</span>
          {dateFilter !== "all" && (
            <span className="filter-tag">
              Date: {dateFilter === "today" ? "Aujourd'hui" : dateFilter === "week" ? "Cette semaine" : "Ce mois"}
            </span>
          )}
          {popularFilter && <span className="filter-tag">Les plus populaires</span>}
        </div>
      </div>
      
      {/* Contenu des résultats */}
      <div className="search-results-content">
        {loading ? (
          <div className="loading">Chargement des résultats...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {/* Tweets */}
            {(type === "all" || type === "tweets") && results?.tweets && (
              <div className="results-section">
                <h2>Tweets {results.tweets.length > 0 && `(${results.tweets.length})`}</h2>
                {results.tweets.length > 0 ? (
                  <div className="tweet-list">
                    {results.tweets.map(tweet => (
                      <div key={tweet.id} className="tweet-card">
                        <Link to={`/profile/${tweet.author}`} className="tweet-author">
                          <img 
                            src={tweet.profilePic || DEFAULT_PROFILE_PIC} 
                            alt={tweet.author}
                            onError={(e) => {e.target.src = DEFAULT_PROFILE_PIC}}
                          />
                          <span>@{tweet.author}</span>
                        </Link>
                        <Link to={`/tweet/${tweet.id}`} className="tweet-content">
                          {tweet.content}
                        </Link>
                        <div className="tweet-footer">
                          <span className="tweet-date">{new Date(tweet.createdAt).toLocaleString()}</span>
                          <span className="tweet-stats">
                            {tweet.likes} likes • {tweet.replies} réponses
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results-message">Aucun tweet trouvé 😕</div>
                )}
              </div>
            )}
            
            {/* Utilisateurs */}
            {(type === "all" || type === "users") && results?.users && (
              <div className="results-section">
                <h2>Utilisateurs {results.users.length > 0 && `(${results.users.length})`}</h2>
                {results.users.length > 0 ? (
                  <div className="users-list">
                    {results.users.map(user => (
                      <Link to={`/profile/${user.username}`} key={user.id} className="user-card">
                        <img 
                          src={user.profilePic || DEFAULT_PROFILE_PIC} 
                          alt={user.username}
                          className="user-avatar"
                          onError={(e) => {e.target.src = DEFAULT_PROFILE_PIC}}
                        />
                        <div className="user-info">
                          <h3 className="user-name">{user.name || user.username}</h3>
                          <span className="user-username">@{user.username}</span>
                          {user.bio && <p className="user-bio">{user.bio}</p>}
                          <div className="user-stats">
                            <span>{user.followers || 0} followers</span>
                            <span>{user.following || 0} following</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="no-results-message">Aucun utilisateur trouvé 😕</div>
                )}
              </div>
            )}
            
            {/* Hashtags */}
            {(type === "all" || type === "hashtags") && results?.hashtags && (
              <div className="results-section">
                <h2>Hashtags {results.hashtags.length > 0 && `(${results.hashtags.length})`}</h2>
                {results.hashtags.length > 0 ? (
                  <div className="hashtags-list">
                    {results.hashtags.map(hashtag => (
                      <Link 
                        to={`/hashtag/${hashtag.name.substring(1)}`} 
                        key={hashtag.id || hashtag.name} 
                        className="hashtag-card"
                      >
                        <span className="hashtag-name">{hashtag.name}</span>
                        <span className="hashtag-count">{hashtag.count || 0} posts</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="no-results-message">Aucun hashtag trouvé 😕</div>
                )}
              </div>
            )}
            
            {/* Si aucun résultat n'est trouvé dans aucune catégorie */}
            {(!results?.tweets || results.tweets.length === 0) &&
             (!results?.users || results.users.length === 0) &&
             (!results?.hashtags || results.hashtags.length === 0) && (
              <div className="no-results-global">
                <h2>Aucun résultat trouvé pour "{query}"</h2>
                <p>Suggestions :</p>
                <ul>
                  <li>Vérifiez l'orthographe des mots-clés</li>
                  <li>Essayez des mots-clés plus généraux</li>
                  <li>Essayez d'autres catégories</li>
                  <li>Essayez de rechercher sans filtres de date</li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
