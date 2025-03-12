import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { likeComment, deleteComment } from '../../services/apiComments';
import './CommentItem.scss';

const DEFAULT_PROFILE_PIC = `${process.env.PUBLIC_URL}/Images/defaultuser.jpg`;

const CommentItem = ({ comment }) => {
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false); // Idéalement, vérifier si l'utilisateur actuel a liké
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (error) {
      return 'date inconnue';
    }
  };

  const handleLikeClick = async () => {
    try {
      await likeComment(comment._id);
      if (isLiked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Erreur lors du like du commentaire:', error);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      setIsDeleting(true);
      try {
        await deleteComment(comment._id);
        // Ici, vous pourriez vouloir informer le parent de la suppression
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
        setIsDeleting(false);
      }
    }
  };

  if (isDeleting) return null; // Ne plus afficher le commentaire supprimé

  return (
    <div className="comment-item">
      <div className="comment-header">
        <Link to={`/profile/${comment.userId._id}`} className="user-profile">
          <img 
            src={comment.userId.profilePic || DEFAULT_PROFILE_PIC}
            alt={comment.userId.username} 
            className="user-avatar" 
          />
          <span className="user-name">{comment.userId.username}</span>
        </Link>
        <span className="comment-timestamp">{formatDate(comment.createdAt)}</span>
      </div>
      
      <p className="comment-content">{comment.content}</p>
      
      <div className="comment-actions">
        <button 
          className={`like-button ${isLiked ? 'liked' : ''}`} 
          onClick={handleLikeClick}
        >
          {likes} ❤️
        </button>
        
        {/* Afficher le bouton de suppression uniquement pour l'auteur */}
        {comment.userId._id === localStorage.getItem('userId') && (
          <button className="delete-button" onClick={handleDeleteClick}>
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
