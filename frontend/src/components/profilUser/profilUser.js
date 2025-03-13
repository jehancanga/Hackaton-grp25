import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './profilUser.scss';

const DEFAULT_AVATAR = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;

const UserProfile = () => {
  const { userId: identifier } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState({
    _id: '',
    name: '',
    username: '',
    tweets: [],
    followersCount: 0,
    followingCount: 0,
    profilePic: '',
    bio: ''  // Ajout d'un champ bio
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followToggleLoading, setFollowToggleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tweets'); // Pour la navigation entre les tweets et d'autres sections

  // Récupérer les données de l'utilisateur actuel depuis le localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user._id) {
      setCurrentUserId(user._id);
    }
  }, []);

  const fetchUserData = async () => {
    if (!identifier) {
      setError("Identifiant utilisateur manquant");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDetailedError(null);
    
    try {
      // Récupérer le token d'authentification depuis le localStorage
      const token = localStorage.getItem('token');
      
      // Préparer les headers avec le token d'authentification
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Utiliser l'endpoint pour récupérer l'utilisateur
      const apiUrl = `http://localhost:3000/api/users/${identifier}`;
      console.log("URL API:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur serveur ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data) {
        throw new Error("Données vides ou format invalide");
      }
      
      // Adapter les données reçues au format attendu par notre UI
      setUserData({
        _id: data._id, 
        name: data.name || data.username || 'Utilisateur',
        username: data.username || 'utilisateur',
        tweets: Array.isArray(data.tweets) ? data.tweets : [],
        followersCount: data.followers ? data.followers.length : 0,
        followingCount: data.following ? data.following.length : 0,
        profilePic: data.profilePic || data.profilePicture || DEFAULT_AVATAR,
        bio: data.bio || 'Aucune biographie disponible'
      });
      
      // Si nous sommes connectés, vérifier si nous suivons déjà cet utilisateur
      if (token && currentUserId && data._id !== currentUserId) {
        checkFollowStatus(data._id);
      }

      // Récupérer les tweets de l'utilisateur
      fetchUserTweets(data._id);
      
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur détaillée:", err);
      setError("Erreur lors du chargement des données");
      setDetailedError(err.message);
      setIsLoading(false);
    }
  };

  const fetchUserTweets = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost:3000/api/tweets/user/${userId}`, {
        headers: headers
      });
      
      if (!response.ok) {
        console.log("Erreur lors de la récupération des tweets:", response.status);
        return;
      }
      
      const tweets = await response.json();
      
      // Mettre à jour les tweets de l'utilisateur
      setUserData(prevData => ({
        ...prevData,
        tweets: Array.isArray(tweets) ? tweets : []
      }));
    } catch (err) {
      console.error("Erreur lors de la récupération des tweets:", err);
    }
  };

  // Fonction pour vérifier le statut de suivi
  const checkFollowStatus = async (userId) => {
    if (!currentUserId || currentUserId === userId) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/api/users/follow/status/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Statut de suivi:", data);
        setIsFollowing(data.isFollowing);
        
        // Mettre à jour les compteurs si nécessaire
        setUserData(prevData => ({
          ...prevData,
          followersCount: data.followerCount,
          followingCount: data.followingCount
        }));
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du statut de suivi:", err);
    }
  };

  // Fonction pour gérer le clic sur suivre/ne plus suivre
  const handleFollowToggle = async () => {
    if (!currentUserId || !userData._id || currentUserId === userData._id) {
      console.log("Action non autorisée: Impossible de suivre/ne plus suivre cet utilisateur");
      return;
    }
    
    setFollowToggleLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      // Déterminer l'action à effectuer (suivre ou ne plus suivre)
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      
      console.log(`Tentative de ${endpoint} pour l'utilisateur ${userData._id}`);
      
      const response = await fetch(`http://localhost:3000/api/users/${endpoint}/${userData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur lors de la tentative de ${endpoint}`);
      }
      
      // Récupérer la réponse
      const responseData = await response.json();
      console.log("Réponse de l'API:", responseData);
      
      // Mettre à jour l'état en fonction des données retournées par l'API
      setIsFollowing(responseData.isFollowing);
      setUserData(prevData => ({
        ...prevData,
        followersCount: responseData.followerCount
      }));
      
      // Mettre à jour les données locales pour l'utilisateur actuel si nécessaire
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          
          const updatedUser = { 
            ...user,
            followingCount: responseData.followingCount 
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.warn("Impossible de mettre à jour les données locales:", err);
      }
      
    } catch (err) {
      console.error("Erreur lors de la modification du suivi:", err);
      alert(`Erreur: ${err.message || "Une erreur est survenue lors de la modification du suivi."}`);
    } finally {
      setFollowToggleLoading(false);
    }
  };

  useEffect(() => {
    if (identifier && currentUserId) {
      fetchUserData();
    }
  }, [identifier, currentUserId]);

  if (isLoading) {
    return (
      <div className="profile-container loading-container">
        <div className="loading">Chargement du profil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container error-container">
        <div className="error">
          <h3>Erreur</h3>
          <div>{error}</div>
          {detailedError && (
            <div className="error-details">
              Détails: {detailedError}
            </div>
          )}
          <button onClick={fetchUserData} className="retry-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="profile-container">
      {/* Bannière de profil */}
      <div className="profile-banner"></div>
      
      {/* En-tête du profil */}
      <div className="profile-header">
        {/* Photo de profil */}
        <div className="profile-image-container">
          <img 
            src={userData.profilePic} 
            alt={`Photo de profil de ${userData.name}`} 
            className="profile-image"
          />
        </div>
        
        {/* Bouton Suivre/Ne plus suivre */}
        {currentUserId && currentUserId !== userData._id && (
          <div className="follow-button-container">
            <button 
              className={`follow-button ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowToggle}
              disabled={followToggleLoading}
            >
              {followToggleLoading 
                ? 'Chargement...' 
                : isFollowing ? 'Ne plus suivre' : 'Suivre'}
            </button>
          </div>
        )}
      </div>
      
      {/* Informations de l'utilisateur */}
      <div className="user-info">
        <h2 className="user-name">{userData.name}</h2>
        <p className="user-username">@{userData.username}</p>
        <p className="user-bio">{userData.bio}</p>
      </div>
      
      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-item" onClick={() => setActiveTab('following')}>
          <span className="stat-value">{userData.followingCount}</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="stat-item" onClick={() => setActiveTab('followers')}>
          <span className="stat-value">{userData.followersCount}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{userData.tweets.length}</span>
          <span className="stat-label">Tweets</span>
        </div>
      </div>
      
      {/* Onglets de navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'tweets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tweets')}
        >
          Tweets
        </button>
        <button 
          className={`tab-button ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Médias
        </button>
        <button 
          className={`tab-button ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          J'aime
        </button>
      </div>
      
      {/* Contenu principal */}
      <div className="profile-content">
        {activeTab === 'tweets' && (
          <div className="tweets-section">
            {userData.tweets.length === 0 ? (
              <div className="no-tweets">
                Cet utilisateur n'a pas encore publié de tweets.
              </div>
            ) : (
              <div className="tweets-list">
                {userData.tweets.map(tweet => (
                  <div key={tweet._id} className="tweet-card">
                    <div className="tweet-header">
                      <img 
                        src={userData.profilePic} 
                        alt={userData.name} 
                        className="tweet-avatar"
                      />
                      <div className="tweet-user-info">
                        <span className="tweet-user-name">{userData.name}</span>
                        <span className="tweet-user-username">@{userData.username}</span>
                        <span className="tweet-date">{formatDate(tweet.createdAt)}</span>
                      </div>
                    </div>
                    <div className="tweet-content">{tweet.content}</div>
                    <div className="tweet-actions">
                      <button className="action-button">
                        <i className="far fa-comment"></i>
                        <span>{tweet.comments?.length || 0}</span>
                      </button>
                      <button className="action-button">
                        <i className="fas fa-retweet"></i>
                        <span>{tweet.retweets?.length || 0}</span>
                      </button>
                      <button className="action-button">
                        <i className="far fa-heart"></i>
                        <span>{tweet.likes?.length || 0}</span>
                      </button>
                      <button className="action-button">
                        <i className="far fa-share-square"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'media' && (
          <div className="media-section">
            <div className="no-content">
              Aucun média partagé par cet utilisateur.
            </div>
          </div>
        )}
        
        {activeTab === 'likes' && (
          <div className="likes-section">
            <div className="no-content">
              Aucun tweet likéé par cet utilisateur.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
