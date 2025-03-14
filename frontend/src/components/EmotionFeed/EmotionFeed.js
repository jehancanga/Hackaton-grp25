// components/EmotionFeed/EmotionFeed.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTweetsByEmotion, batchAnalyzeEmotions } from '../../services/apiEmotion';
import Post from '../Post/Post';
import './EmotionFeed.scss';

const EmotionFeed = ({ initialEmotion }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(initialEmotion || 'all');
  const navigate = useNavigate();
  const { emotion: paramEmotion } = useParams(); // Pour supporter /emotion/:emotion

  const emotions = [
    { id: 'all', label: 'all', icon: '🌐' },
    { id: 'happy', label: 'happy', icon: '😊', color: '#FFCE54' },
    { id: 'sad', label: 'sad', icon: '😢', color: '#8CC9E8' },
    { id: 'angry', label: 'angry', icon: '😠', color: '#FC6E51' },
    { id: 'surprise', label: 'surprise', icon: '😲', color: '#AC92EC' },
    { id: 'fear', label: 'fear', icon: '😨', color: '#A0D468' },
    { id: 'disgust', label: 'disgust', icon: '🤢', color: '#48CFAD' },
    { id: 'neutral', label: 'neutral', icon: '😐', color: '#CCD1D9' }
  ];
  
  useEffect(() => {
    // Priorité: paramètre URL > props initialEmotion > état par défaut
    const emotionToUse = paramEmotion || initialEmotion || 'all';
    if (emotionToUse !== selectedEmotion) {
      setSelectedEmotion(emotionToUse);
    }
  }, [paramEmotion, initialEmotion]);

  useEffect(() => {
    loadPosts();
  }, [selectedEmotion]);
  
  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getTweetsByEmotion(selectedEmotion);
      
      if (fetchedPosts && Array.isArray(fetchedPosts)) {
        setPosts(fetchedPosts);
      } else {
        console.error("Format de données inattendu:", fetchedPosts);
        setPosts([]);
      }
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
    setSelectedEmotion(newEmotion);
    
    // Si on est sur une route avec paramètre d'émotion, mettre à jour l'URL
    if (paramEmotion) {
      navigate(`/emotion/${newEmotion}`);
    }
  };
  
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const result = await batchAnalyzeEmotions();
      await loadPosts(); // Recharger les posts après l'analyse
      alert(`Analyse terminée ! ${result.processed} tweets analysés.`);
    } catch (error) {
      console.error("Erreur lors de l'analyse des émotions:", error);
      alert('Erreur lors de l\'analyse des émotions');
    } finally {
      setAnalyzing(false);
    }
  };
  
  if (loading) {
    return <div className="feed-loading">Load tweets...</div>;
  }
  
  if (error) {
    return <div className="feed-error">{error}</div>;
  }
  
  return (
    <div className="emotion-feed">
      <div className="emotion-controls">
        <h2>Filter by emotion</h2>
        <div className="emotion-filters">
          {emotions.map((em) => (
            <button
              key={em.id}
              onClick={() => handleEmotionChange(em.id)}
              className={`emotion-filter ${selectedEmotion === em.id ? 'active' : ''}`}
              style={{ 
                backgroundColor: em.color,
                opacity: selectedEmotion === em.id ? 1 : 0.7
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
          {analyzing ? 'Analyzing...' : 'Analyzing tweet emotions'}
        </button>
      </div>
      
      {(!posts || posts.length === 0) ? (
        <div className="feed-no-posts">No tweet for this emotion</div>
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