import React, { useState } from 'react';

const LikeButton = ({ tweetId, likes }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    // Envoyer une requête API pour liker le tweet
  };

  return (
    <button onClick={handleLike}>
      {liked ? 'Unlike' : 'Like'} ({likes + (liked ? 1 : 0)})
    </button>
  );
};

export default LikeButton;