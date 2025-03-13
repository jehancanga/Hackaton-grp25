import { useState, useEffect } from 'react';
import { FaHeart, FaRetweet, FaComment } from 'react-icons/fa';
import { likeTweet, unlikeTweet, retweet, unretweet } from '../../services/apiPosts';
import './PostActions.scss';

// Fonction utilitaire pour obtenir l'ID de l'utilisateur actuel
const getCurrentUserId = () => {
  return localStorage.getItem('userId') || sessionStorage.getItem('userId');
};

const PostActions = ({ post, onCommentClick, onPostUpdate }) => {
  // États pour les opérations en cours
  const [isLiking, setIsLiking] = useState(false);
  const [isRetweeting, setIsRetweeting] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [retweetCount, setRetweetCount] = useState(post.retweets || 0);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [userLiked, setUserLiked] = useState(post.userLiked || false);
  const [userRetweeted, setUserRetweeted] = useState(post.userRetweeted || false);
  
  // Mise à jour des états quand le post change
  useEffect(() => {
    if (!post) return;
    
    const currentUserId = getCurrentUserId();
    
    // Déterminer si l'utilisateur a liké
    if (Array.isArray(post.likes)) {
      setUserLiked(post.likes.includes(currentUserId));
      setLikeCount(post.likes.length);
    } else {
      setUserLiked(false);
      setLikeCount(0);
    }
    
    // Déterminer si l'utilisateur a retweeté
    if (Array.isArray(post.retweets)) {
      setUserRetweeted(post.retweets.includes(currentUserId));
      setRetweetCount(post.retweets.length);
    } else {
      setUserRetweeted(false);
      setRetweetCount(0);
    }
    
    // Nombre de commentaires
    if (Array.isArray(post.comments)) {
      setCommentCount(post.comments.length);
    } else if (typeof post.comments === 'number') {
      setCommentCount(post.comments);
    } else {
      setCommentCount(0);
    }
  }, [post]);
  
  // Gestion du clic sur le bouton "J'aime"
  const handleLikeClick = async () => {
    if (isLiking || !post) return;
    
    setIsLiking(true);
    
    try {
      let response;
      
      // Appeler l'API appropriée selon l'état actuel
      if (userLiked) {
        response = await unlikeTweet(post._id);
      } else {
        response = await likeTweet(post._id);
      }
      
      // Mettre à jour l'UI localement
      setUserLiked(!userLiked);
      setLikeCount(prevCount => userLiked ? prevCount - 1 : prevCount + 1);
      
      // Informer le parent si nécessaire
      if (onPostUpdate && response) {
        onPostUpdate(response);
      }
    } catch (error) {
      console.error("Erreur lors de l'action like:", error);
      // On pourrait ajouter un toast ou une notification ici
    } finally {
      setIsLiking(false);
    }
  };
  
  const handleRetweetClick = async () => {
    if (isRetweeting || !post) return;
    
    setIsRetweeting(true);
    
    try {
      let response;
      
      // Appeler la fonction appropriée selon l'état actuel
      if (userRetweeted) {
        response = await unretweet(post._id);
      } else {
        response = await retweet(post._id);
      }
      
      // Mise à jour de l'UI basée sur la réponse
      if (response) {
        setUserRetweeted(!userRetweeted);
        
        // Mise à jour du compteur de retweets selon la réponse
        if (response.message === "Retweet supprimé") {
          setRetweetCount(prevCount => prevCount - 1);
        } else if (response.message === "Retweet créé") {
          setRetweetCount(prevCount => prevCount + 1);
        }
        
        // Si nous avons une réponse avec l'originalTweet, mettre à jour
        if (response.originalTweet && onPostUpdate) {
          onPostUpdate(response.originalTweet);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du retweet:", error);
    } finally {
      setIsRetweeting(false);
    }
  };
  
  
  

  // Gestion du clic sur le bouton commentaire
  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick(post);
    }
  };
  
  return (
    <div className="post-actions">
      <button 
        className={`action-button like-button ${userLiked ? 'active' : ''}`}
        onClick={handleLikeClick}
        disabled={isLiking}
        aria-label={userLiked ? "Je n'aime plus" : "J'aime"}
      >
        <FaHeart className="action-icon" />
        <span className="action-count">{likeCount > 0 ? likeCount : ''}</span>
      </button>
      
      <button
        className={`action-button retweet-button ${userRetweeted ? 'active' : ''}`}
        onClick={handleRetweetClick}
        disabled={isRetweeting}
        aria-label={userRetweeted ? "Annuler le retweet" : "Retweeter"}
      >
        <FaRetweet className="action-icon" />
        <span className="action-count">{retweetCount > 0 ? retweetCount : ''}</span>
      </button>
      
      <button 
        className="action-button comment-button"
        onClick={handleCommentClick}
        aria-label="Commenter"
      >
        <FaComment className="action-icon" />
        <span className="action-count">{commentCount > 0 ? commentCount : ''}</span>
      </button>
    </div>
  );
};

export default PostActions;
