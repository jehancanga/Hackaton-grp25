// src/components/Feed/HashtagFeed.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTweetsByHashtag } from '../../services/apiPosts';
import Post from '../Post/Post';
import './HashtagFeed.scss';

const HashtagFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hashtag } = useParams(); // Récupère le hashtag depuis l'URL
  const navigate = useNavigate();
  
  useEffect(() => {
    loadHashtagPosts();
  }, [hashtag]);
  
  const loadHashtagPosts = async () => {
    try {
      setLoading(true);
      // Assurez-vous de créer cette fonction dans votre service API
      const fetchedPosts = await getTweetsByHashtag(hashtag);
      
      if (!fetchedPosts) {
        throw new Error("Réponse vide ou invalide");
      }
      
      setPosts(fetchedPosts);
    } catch (err) {
      console.error(`Erreur lors du chargement des tweets avec hashtag #${hashtag}:`, err);
      setError(`Impossible de charger les tweets avec hashtag #${hashtag}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  if (loading) {
    return <div className="feed-loading">Chargement des tweets...</div>;
  }
  
  if (error) {
    return <div className="feed-error">{error}</div>;
  }
  
  if (!posts || posts.length === 0) {
    return <div className="feed-no-posts">Aucun tweet avec #{hashtag} pour le moment</div>;
  }
  
  return (
    <div className="feed">
      <h1 className="hashtag-title">#{hashtag}</h1>
      {posts.map(post => (
        <Post 
          key={post._id} 
          post={post} 
          onUserClick={handleUserClick}
        />
      ))}
    </div>
  );
};

export default HashtagFeed;
