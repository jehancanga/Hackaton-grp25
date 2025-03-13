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
    profilePic: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followToggleLoading, setFollowToggleLoading] = useState(false);

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
        profilePic: data.profilePic || data.profilePicture || DEFAULT_AVATAR
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
      <div className="profile-header">
        <div 
          className="profile-avatar" 
          style={{ backgroundImage: `url(${userData.profilePic})` }}
        ></div>
        <div className="profile-info">
          <div className="profile-name" title={userData.name}>{userData.name}</div>
          <div className="profile-username">@{userData.username}</div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{userData.followingCount}</span>
              <span className="stat-label">Abonnements</span>
            </div>
            <div className="stat">
              <span className="stat-value">{userData.followersCount}</span>
              <span className="stat-label">Abonnés</span>
            </div>
          </div>
        </div>
        
        {/* Afficher le bouton follow/unfollow seulement si nous ne sommes pas sur notre propre profil */}
        {currentUserId && currentUserId !== userData._id && (
          <button 
            className={`follow-button ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowToggle}
            disabled={followToggleLoading}
          >
            {followToggleLoading 
              ? 'Chargement...' 
              : isFollowing ? 'Ne plus suivre' : 'Suivre'}
          </button>
        )}
      </div>
      
      <div className="profile-tweets">
        <h3>Tweets</h3>
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
                  </div>
                </div>
                <div className="tweet-content">{tweet.content}</div>
                <div className="tweet-date">{formatDate(tweet.createdAt)}</div>
                <div className="tweet-actions">
                  <div className="tweet-likes">
                    <i className="far fa-heart"></i> {tweet.likes?.length || 0}
                  </div>
                  <div className="tweet-retweets">
                    <i className="fas fa-retweet"></i> {tweet.retweets?.length || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
