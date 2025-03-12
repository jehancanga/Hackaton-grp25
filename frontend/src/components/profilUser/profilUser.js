import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './profilUser.scss';

const UserProfile = () => {
  const { userId } = useParams(); // Récupère l'id depuis l'URL
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    tweets: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer les données de l'utilisateur
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://votre-api-backend.com/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const userData = await response.json();
        setUserData(userData);
        setIsLoading(false);
        
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };
    const checkFollowStatus = async () => {
      try {
        const response = await fetch(`http://votre-api-backend.com/api/users/${userId}/follow/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Récupérez votre token d'authentification
          }
        });
        
        if (response.ok) {
          const { isFollowing } = await response.json();
          setIsFollowing(isFollowing);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification du statut de suivi:", err);
      }
    };
  
    if (userId) {
      fetchUserData();
      checkFollowStatus(); // Ajoutez cet appel ici
    }
  
    if (userId) {
      fetchUserData();
    }
  }, [userId]);
  
  const handleFollowClick = async () => {
    try {
      const response = await fetch(`http://votre-api-backend.com/api/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Récupérez votre token d'authentification
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du statut de suivi');
      }
      
      setIsFollowing(!isFollowing);
      // Vous pourriez vouloir rafraîchir d'autres données comme le nombre de followers
      
    } catch (err) {
      console.error("Erreur lors du changement de statut de suivi:", err);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  

  // Calcul des statistiques basées sur les tweets
  const tweetCount = userData.tweets ? userData.tweets.length : 0;
  const followerCount = isFollowing ? 1 : 0; // Simplification - dans une vraie app, ça viendrait de l'API
  const followingCount = 0; // Simplification - dans une vraie app, ça viendrait de l'API

  if (isLoading) {
    return <div className="loading">Chargement du profil...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar"></div>
        <div className="profile-name" title={userData.name}>{userData.name}</div>
        <div className="profile-username">@{userData.username}</div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{tweetCount}</span>
            <span className="stat-label">Tweets</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{followerCount}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{followingCount}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
        
        <button 
          className={`follow-button ${isFollowing ? 'unfollow' : ''}`}
          onClick={handleFollowClick}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
      
      <div className="tweet-section">
        <div className="section-title">Tweets</div>
        <div className="tweets-container">
          {tweetCount === 0 ? (
            <div className="no-tweets">Aucun tweet pour le moment</div>
          ) : (
            userData.tweets.map(tweet => (
              <div className="tweet" key={tweet.id}>
                <div className="tweet-content">{tweet.content}</div>
                <div className="tweet-time">{tweet.time}</div>
                <div className="tweet-stats">
                  <span>{tweet.likes} Likes</span> • 
                  <span>{tweet.retweets} Retweets</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;