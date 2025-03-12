// frontend/src/components/RecommendedFeed/RecommendedFeed.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../Post/Post';
import './RecommendedFeed.scss';

const RecommendedFeed = ({ emotion }) => {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (emotion) {
      fetchRecommendedPosts(emotion);
    }
  }, [emotion]);

  const fetchRecommendedPosts = async (emotion) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:3000/api/tweets/recommendations/${emotion}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setRecommendedPosts(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      setError('Impossible de charger les recommandations');
    } finally {
      setLoading(false);
    }
  };

  if (!emotion) return null;
  
  return (
    <div className="recommended-feed">
      <h3 className="feed-title">
        Recommandé pour votre humeur <span className="emotion-tag">{emotion}</span>
      </h3>
      
      {loading && <div className="loading">Chargement des recommandations...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && recommendedPosts.length === 0 && (
        <div className="no-posts">Aucune recommandation disponible</div>
      )}
      
      {!loading && !error && recommendedPosts.length > 0 && (
        <div className="posts">
          {recommendedPosts.map(post => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedFeed;