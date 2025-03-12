import { useState } from 'react';
import { addComment } from '../../services/apiComments';
import './CommentForm.scss';

const CommentForm = ({ tweetId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newComment = await addComment(tweetId, content);
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (err) {
      setError('Impossible d\'ajouter votre commentaire. Veuillez réessayer.');
      console.error('Erreur lors de l\'ajout du commentaire:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrivez votre commentaire..."
        disabled={isLoading}
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={isLoading || !content.trim()}>
        {isLoading ? 'Envoi...' : 'Commenter'}
      </button>
    </form>
  );
};

export default CommentForm;
