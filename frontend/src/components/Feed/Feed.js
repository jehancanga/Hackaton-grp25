// src/components/Feed/Feed.jsx
import { useState, useEffect } from 'react';
import { getAllTweets } from '../../services/apiPosts';
import Post from '../Post/Post';
import './Feed.scss';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadPosts();
  }, []);
  
  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getAllTweets();
      
      if (!fetchedPosts) {
        throw new Error("Réponse vide ou invalide");
      }
      
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Erreur lors du chargement des posts:", err);
      setError("Impossible de charger les tweets");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="feed-loading">Chargement des tweets...</div>;
  }
  
  if (error) {
    return <div className="feed-error">{error}</div>;
  }
  
  if (!posts || posts.length === 0) {
    return <div className="feed-no-posts">Aucun tweet pour le moment</div>;
  }
  
  return (
    <div className="feed">
      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
