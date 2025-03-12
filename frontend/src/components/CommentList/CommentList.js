import { useState, useEffect } from 'react';
import { getComments } from '../../services/apiComments';
import CommentItem from '../CommentItem/CommentItem';
import './CommentList.scss';

const CommentList = ({ tweetId, newComment }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(tweetId);
        setComments(data);
      } catch (err) {
        setError('Impossible de charger les commentaires.');
        console.error('Erreur lors du chargement des commentaires:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [tweetId]);

  // Ajouter un nouveau commentaire à la liste sans recharger
  useEffect(() => {
    if (newComment) {
      setComments(prevComments => [newComment, ...prevComments]);
    }
  }, [newComment]);

  if (isLoading) return <div className="loading-comments">Chargement des commentaires...</div>;
  if (error) return <div className="error-comments">{error}</div>;

  return (
    <div className="comments-list">
      {comments.length === 0 ? (
        <p className="no-comments">Aucun commentaire pour le moment</p>
      ) : (
        comments.map(comment => (
          <CommentItem 
            key={comment._id} 
            comment={comment} 
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
