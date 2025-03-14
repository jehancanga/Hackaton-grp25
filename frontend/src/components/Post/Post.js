// components/Post/Post.jsx
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaHeart, FaRegHeart, FaRetweet, FaComment, FaTrash } from 'react-icons/fa';
import { likeTweet, deleteTweet, retweetPost } from '../../services/apiPosts';
import { API_URL } from '../../services/api';
import './Post.scss';

const Post = ({ post, onUserClick, onUpdate, onDelete }) => {
  const [currentPost, setCurrentPost] = useState(post);
  const [isLoading, setIsLoading] = useState(false);
  
  // Gérer le clic sur l'utilisateur
  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick(post.userId._id);
    }
  };
  
  // Gérer le like
  const handleLike = async () => {
    try {
      setIsLoading(true);
      const updatedPost = await likeTweet(post._id);
      setCurrentPost(updatedPost);
      if (onUpdate) onUpdate(updatedPost);
    } catch (error) {
      console.error("Erreur lors du like:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer le retweet
  const handleRetweet = async () => {
    try {
      setIsLoading(true);
      const response = await retweetPost(post._id);
      if (response && response.originalTweet) {
        setCurrentPost(response.originalTweet);
        if (onUpdate) onUpdate(response.originalTweet);
      }
    } catch (error) {
      console.error("Erreur lors du retweet:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer la suppression
  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce tweet ?")) {
      try {
        setIsLoading(true);
        await deleteTweet(post._id);
        if (onDelete) onDelete(post._id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Convertir le texte en incluant les hashtags cliquables
  const renderTextWithHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = hashtagRegex.exec(text)) !== null) {
      // Ajouter le texte avant le hashtag
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Ajouter le hashtag stylisé
      const hashtag = match[0]; // Le hashtag complet avec #
      parts.push(
        <span key={match.index} className="hashtag">
          {hashtag}
        </span>
      );
      
      lastIndex = match.index + hashtag.length;
    }
    
    // Ajouter le reste du texte après le dernier hashtag
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };
  
  // Vérifier si les données sont disponibles
  if (!currentPost || !currentPost.userId) {
    return <div className="post error">Données du post indisponibles</div>;
  }
  
  // Calculer la date relative
  let relativeTime = "Date inconnue";
  if (currentPost.createdAt) {
    try {
      const date = new Date(currentPost.createdAt);
      if (!isNaN(date.getTime())) { // Vérifie si la date est valide
        relativeTime = formatDistanceToNow(date, {
          addSuffix: true,
          locale: fr
        });
      }
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
    }
  }
    
  // Badge d'émotion
  const getEmotionIcon = (emotion) => {
    const emotionIcons = {
      "happy": "😊",
      "sad": "😢",
      "angry": "😠",
      "fear": "😨",
      "disgust": "🤢",
      "surprise": "😲",
      "neutral": "😐"
    };
    return emotionIcons[emotion] || "😐";
  };
  
  // Récupérer l'ID de l'utilisateur connecté
  const currentUserId = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user'))._id 
    : null;
  
  // Vérifier si l'utilisateur a aimé ce post
  const isLiked = currentPost.likes.includes(currentUserId);
  
  // Vérifier si l'utilisateur est l'auteur du post
  const isAuthor = currentUserId === currentPost.userId._id;
  
  return (
    <div className={`post ${isLoading ? 'loading' : ''}`}>
      {/* En-tête du post */}
      <div className="post-header">
        <div className="user-info" onClick={handleUserClick}>
          <img 
            src={currentPost.userId.profilePic} 
            alt={currentPost.userId.username}
            onError={(e) => {
              e.target.src = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;
            }}
            className="avatar"
          />
          <div className="user-details">
            <span className="username">{currentPost.userId.username}</span>
            <span className="timestamp">{relativeTime}</span>
          </div>
        </div>
        
        {/* Badge de catégorie et émotion */}
        <div className="post-badges">
          {currentPost.category && (
            <span className="category-badge">
              {currentPost.category}
            </span>
          )}
          {currentPost.detectedEmotion && (
            <span className="emotion-badge" title={`Émotion: ${currentPost.detectedEmotion}`}>
              {getEmotionIcon(currentPost.detectedEmotion)}
            </span>
          )}
        </div>
      </div>
      
      {/* Contenu du post */}
      <div className="post-content">
        <p>{renderTextWithHashtags(currentPost.content)}</p>
        
        {/* Affichage des hashtags en dessous du contenu */}
        {currentPost.hashtags && currentPost.hashtags.length > 0 && (
          <div className="hashtags-container">
            {currentPost.hashtags.map((tag, index) => (
              <span key={index} className="hashtag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Image/média si disponible */}
        {currentPost.media && (
        <img 
          src={currentPost.media.startsWith('data:') 
            ? currentPost.media 
            : currentPost.media.startsWith('/uploads') 
              ? `http://localhost:3000${currentPost.media}`
              : currentPost.media}
          alt="Contenu média" 
          className="post-media"
          onError={(e) => {
            console.error("Erreur de chargement de l'image:", currentPost.media);
            e.target.style.display = 'none'; // Cacher l'image si erreur
          }}
        />
      )}
      </div>
      
      {/* Actions du post */}
      <div className="post-actions">
        <button 
          className={`action-button like-button ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
          disabled={isLoading}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span className="count">{currentPost.likes.length || 0}</span>
        </button>
        
        <button 
          className="action-button retweet-button"
          onClick={handleRetweet}
          disabled={isLoading}
        >
          <FaRetweet />
          <span className="count">{currentPost.retweets.length || 0}</span>
        </button>
        
        <button className="action-button comment-button" disabled>
          <FaComment />
          <span className="count">{currentPost.comments?.length || 0}</span>
        </button>
        
        {isAuthor && (
          <button 
            className="action-button delete-button"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;