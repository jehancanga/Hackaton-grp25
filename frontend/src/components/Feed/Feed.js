import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllTweets } from '../../services/apiPosts';
import { getTweetsByEmotion, batchAnalyzeEmotions } from '../../services/apiEmotion';
import Post from '../Post/Post';
import './Feed.scss';

const EmotionFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { emotion } = useParams();
  const navigate = useNavigate();

  const emotions = [
    { id: 'all', label: 'Tous', icon: '🌐' },
    { id: 'happy', label: 'Heureux', icon: '😊', color: '#FFCE54' },
    { id: 'sad', label: 'Triste', icon: '😢', color: '#8CC9E8' },
    { id: 'angry', label: 'En colère', icon: '😠', color: '#FC6E51' },
    { id: 'surprise', label: 'Surpris', icon: '😲', color: '#AC92EC' },
    { id: 'fear', label: 'Effrayé', icon: '😨', color: '#A0D468' },
    { id: 'disgust', label: 'Dégoûté', icon: '🤢', color: '#48CFAD' },
    { id: 'neutral', label: 'Neutre', icon: '😐', color: '#CCD1D9' }
  ];
  
  useEffect(() => {
    loadPosts();
  }, [emotion]);
  
  const loadPosts = async () => {
    try {
      setLoading(true);
      let fetchedPosts;
      
      if (!emotion || emotion === 'all') {
        fetchedPosts = await getAllTweets();
      } else {
        fetchedPosts = await getTweetsByEmotion(emotion);
      }
      
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
  
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  const handleEmotionChange = (newEmotion) => {
    navigate(`/emotion/${newEmotion}`);
  };
  
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      await batchAnalyzeEmotions();
      await loadPosts(); // Recharger les posts après l'analyse
      alert('Analyse des émotions terminée !');
    } catch (error) {
      console.error("Erreur lors de l'analyse des émotions:", error);
      alert('Erreur lors de l\'analyse des émotions');
    } finally {
      setAnalyzing(false);
    }
  };
  
  if (loading) {
    return <div className="feed-loading">Chargement des tweets...</div>;
  }
  
  if (error) {
    return <div className="feed-error">{error}</div>;
  }
  
  return (
    <div className="feed emotion-feed">
      <div className="emotion-controls">
        <div className="emotion-filters">
          {emotions.map((em) => (
            <button
              key={em.id}
              onClick={() => handleEmotionChange(em.id)}
              className={`emotion-filter ${emotion === em.id ? 'active' : ''}`}
              style={{ 
                backgroundColor: em.color,
                opacity: emotion === em.id ? 1 : 0.7
              }}
            >
              <span className="emotion-icon">{em.icon}</span>
              <span className="emotion-label">{em.label}</span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleAnalyze}
          className="analyze-button"
          disabled={analyzing}
        >
          {analyzing ? 'Analyse en cours...' : 'Analyser les émotions'}
        </button>
      </div>
      
      {!posts || posts.length === 0 ? (
        <div className="feed-no-posts">Aucun tweet pour cette émotion</div>
      ) : (
        <div className="feed-posts">
          {posts.map(post => (
            <Post 
              key={post._id} 
              post={post} 
              onUserClick={handleUserClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmotionFeed;

// // src/components/Feed/Feed.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllTweets } from '../../services/apiPosts';
// import Post from '../Post/Post';
// import './Feed.scss';

// const Feed = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     loadPosts();
//   }, []);
  
//   const loadPosts = async () => {
//     try {
//       setLoading(true);
//       const fetchedPosts = await getAllTweets();
      
//       if (!fetchedPosts) {
//         throw new Error("Réponse vide ou invalide");
//       }
      
//       setPosts(fetchedPosts);
//     } catch (err) {
//       console.error("Erreur lors du chargement des posts:", err);
//       setError("Impossible de charger les tweets");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleUserClick = (userId) => {
//     navigate(`/profile/${userId}`);
//   };
  
//   if (loading) {
//     return <div className="feed-loading">Chargement des tweets...</div>;
//   }
  
//   if (error) {
//     return <div className="feed-error">{error}</div>;
//   }
  
//   if (!posts || posts.length === 0) {
//     return <div className="feed-no-posts">Aucun tweet pour le moment</div>;
//   }
  
//   return (
//     <div className="feed">
//       {posts.map(post => (
//         <Post 
//           key={post._id} 
//           post={post} 
//           onUserClick={handleUserClick}
//         />
//       ))}
//     </div>
//   );
// };

// export default Feed;
