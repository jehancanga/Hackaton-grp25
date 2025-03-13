import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import fr from 'date-fns/locale/fr';
import PostActions from '../PostActions/PostActions';
import CommentForm from '../CommentForm/CommentForm';
import CommentList from '../CommentList/CommentList';
import './Post.scss';

const DEFAULT_PROFILE_PIC = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;

const Post = ({ post }) => {
  console.log("Post reçu par le composant:", post);
  
  // Tous les hooks doivent être appelés au début
  const [showComments, setShowComments] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);
  const [newComment, setNewComment] = useState(null);
  
  // Assurer que les données sont correctement structurées
  useEffect(() => {
    if (post) {
      setUpdatedPost(post);
    }
  }, [post]);
  
  if (!updatedPost) {
    console.error("Post non disponible");
    return null;
  }
  
  // Déterminer la structure correcte pour l'utilisateur et le contenu
  const user = updatedPost.user || updatedPost.userId || {};
  const postContent = updatedPost.text || updatedPost.content || '';
  
  console.log("Données structurées:", {
    postId: updatedPost._id,
    content: postContent,
    user: user
  });
  
  const handleCommentClick = () => {
    setShowComments(!showComments);
  };
  
  const handlePostUpdate = (updatedPostData) => {
    setUpdatedPost(updatedPostData);
  };
  
  const handleCommentAdded = (comment) => {
    setNewComment(comment);
    setUpdatedPost(prev => ({
      ...prev,
      comments: (prev.comments || 0) + 1
    }));
  };
  
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return 'date inconnue';
    }
  };
  
  
  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/profile/${user._id || user.id || 'unknown'}`} className="user-profile">
          <img 
            src={user.profilePic || user.profilePicture || DEFAULT_PROFILE_PIC}
            alt={user.username || user.name || 'Utilisateur'} 
            className="user-avatar" 
          />
          <div className="user-info">
            <span className="user-name">{user.username || user.name || 'Utilisateur inconnu'}</span>
            <span className="post-timestamp">{formatDate(updatedPost.createdAt)}</span>
          </div>
        </Link>
        
        {updatedPost.isRetweet && updatedPost.retweetedBy && (
          <div className="retweet-info">
            <span>Retweeté par {updatedPost.retweetedBy.username || 'un utilisateur'}</span>
          </div>
        )}
      </div>
      
      <div className="post-body">
        {postContent ? (
          <p className="post-text">{postContent}</p>
        ) : (
          <p className="post-text post-empty">Ce post ne contient pas de texte</p>
        )}
        
        {updatedPost.image && (
          <img 
            src={updatedPost.image} 
            alt="Post"
            className="post-image" 
            onError={(e) => {
              console.error("Erreur de chargement d'image:", e);
              e.target.style.display = 'none';
            }}
          />
        )}
      </div>
      
      <PostActions 
        post={updatedPost}
        onCommentClick={handleCommentClick}
        onPostUpdate={handlePostUpdate}
      />
      
      {showComments && (
        <div className="post-comments-section">
          <CommentForm 
            tweetId={updatedPost._id}
            onCommentAdded={handleCommentAdded}
          />
          <CommentList 
            tweetId={updatedPost._id}
            newComment={newComment}
          />
        </div>
      )}
    </div>
  );
};

export default Post;
