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
        // Ici, vous feriez une vraie requête API
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();
        
        // Simulation d'une réponse API
        setTimeout(() => {
          // Données de démonstration - à remplacer par votre API
          const mockUserData = {
            id: userId,
            name: `Utilisateur ${userId}`,
            username: `user${userId}`,
            tweets: userId % 2 === 0 ? [
              {
                id: 1,
                content: "Bonjour à tous ! C'est mon premier tweet.",
                time: "Il y a 2 heures",
                likes: 5,
                retweets: 2
              },
              {
                id: 2,
                content: "J'adore cette nouvelle plateforme !",
                time: "Il y a 1 jour",
                likes: 12,
                retweets: 3
              }
            ] : []
          };
          
          setUserData(mockUserData);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]); // S'exécute à chaque changement d'ID d'utilisateur

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    
    // Ici, vous pourriez également envoyer une requête à votre API
    // pour mettre à jour l'état de suivi
    // fetch(`/api/users/${userId}/follow`, { method: 'POST' })
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