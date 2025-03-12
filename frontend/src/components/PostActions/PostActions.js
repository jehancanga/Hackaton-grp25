// src/components/Post/PostActions/PostActions.jsx
import { useState } from 'react';
import { FaHeart, FaRetweet, FaComment } from 'react-icons/fa';
import { likeTweet, unlikeTweet, retweet, unretweet } from '../../services/apiPosts';
import './PostActions.scss';

const PostActions = ({ post, onCommentClick, onPostUpdate }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isRetweeting, setIsRetweeting] = useState(false);
  
  // Pour cet exemple, utilisons l'état local
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [retweetCount, setRetweetCount] = useState(post.retweets || 0);
  const [commentCount, setCommentCount] = useState(post.comments || 0);
  const [userLiked, setUserLiked] = useState(post.userLiked || false);
  const [userRetweeted, setUserRetweeted] = useState(post.userRetweeted || false);

  const handleLikeClick = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (userLiked) {
        await unlikeTweet(post._id);
        setLikeCount(prev => prev - 1);
        setUserLiked(false);
      } else {
        await likeTweet(post._id);
        setLikeCount(prev => prev + 1);
        setUserLiked(true);
      }
      
      // Informer le composant parent de la mise à jour
      if (onPostUpdate) {
        onPostUpdate({
          ...post,
          likes: userLiked ? likeCount - 1 : likeCount + 1,
          userLiked: !userLiked
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'action like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRetweetClick = async () => {
    if (isRetweeting) return;
    
    setIsRetweeting(true);
    try {
      if (userRetweeted) {
        await unretweet(post._id);
        setRetweetCount(prev => prev - 1);
        setUserRetweeted(false);
      } else {
        await retweet(post._id);
        setRetweetCount(prev => prev + 1);
        setUserRetweeted(true);
      }
      
      // Informer le composant parent de la mise à jour
      if (onPostUpdate) {
        onPostUpdate({
          ...post,
          retweets: userRetweeted ? retweetCount - 1 : retweetCount + 1,
          userRetweeted: !userRetweeted
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'action retweet:", error);
    } finally {
      setIsRetweeting(false);
    }
  };

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
      >
        <FaHeart className="action-icon" />
        <span className="action-count">{likeCount > 0 ? likeCount : ''}</span>
      </button>

      <button 
        className={`action-button retweet-button ${userRetweeted ? 'active' : ''}`}
        onClick={handleRetweetClick}
        disabled={isRetweeting}
      >
        <FaRetweet className="action-icon" />
        <span className="action-count">{retweetCount > 0 ? retweetCount : ''}</span>
      </button>

      <button 
        className="action-button comment-button"
        onClick={handleCommentClick}
      >
        <FaComment className="action-icon" />
        <span className="action-count">{commentCount > 0 ? commentCount : ''}</span>
      </button>
    </div>
  );
};

export default PostActions;
