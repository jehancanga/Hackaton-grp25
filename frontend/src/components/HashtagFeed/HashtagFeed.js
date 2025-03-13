import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTweetsByHashtag } from '../../services/apiPosts';
import Post from '../Post/Post';
import './HashtagFeed.scss';

const HashtagFeed = () => {
  const { hashtag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("HashtagFeed: Chargement pour hashtag:", hashtag);
    
    const fetchHashtagPosts = async () => {
      try {
        setLoading(true);
        const data = await getTweetsByHashtag(hashtag);
        console.log("HashtagFeed: Données reçues:", data);
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des posts avec hashtag:", err);
        setError(`Impossible de charger les posts avec le hashtag #${hashtag}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHashtagPosts();
  }, [hashtag]);

  if (loading) return <div className="loading">Chargement des tweets pour #{hashtag}...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!posts || posts.length === 0) return <div className="no-posts">Aucun tweet avec #{hashtag} pour le moment</div>;

  return (
    <div className="hashtag-feed">
      <h1 className="hashtag-title">#{hashtag}</h1>
      <div className="posts-container">
        {posts.map(post => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default HashtagFeed;
