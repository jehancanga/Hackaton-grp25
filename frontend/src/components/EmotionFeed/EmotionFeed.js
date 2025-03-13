import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getTweetsByEmotion, batchAnalyzeEmotions } from '../../services/apiEmotion';
import Post from '../Post/Post';
import './EmotionFeed.scss';

const EmotionFeed = ({ initialEmotion }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(initialEmotion || 'all');
  const location = useLocation();

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
    // Mettre à jour l'émotion sélectionnée si elle est passée par les props
    if (initialEmotion && initialEmotion !== selectedEmotion) {
      setSelectedEmotion(initialEmotion);
    }
  }, [initialEmotion]);

  useEffect(() => {
    loadPosts();
  }, [selectedEmotion]);
  
  const loadPosts = async () => {
    try {
      setLoading(true);
      let fetchedPosts;
      
      if (selectedEmotion === 'all') {
        // Utiliser l'API existante pour tous les posts
        const response = await fetch('http://localhost:5001/api/tweets');
        fetchedPosts = await response.json();
      } else {
        fetchedPosts = await getTweetsByEmotion(selectedEmotion);
      }
      
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Erreur lors du chargement des posts:", err);
      setError("Impossible de charger les tweets");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmotionChange = (newEmotion) => {
    setSelectedEmotion(newEmotion);
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
    return <div className="feed-loading">Chargement des tweets...</div>;
  }
  
  if (error) {
    return <div className="feed-error">{error}</div>;
  }
  
  return (
    <div className="emotion-feed">
      <div className="emotion-controls">
        <h2>Filtrer par émotion</h2>
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
          {analyzing ? 'Analyse en cours...' : 'Analyser les émotions des tweets'}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmotionFeed;