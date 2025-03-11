import React, { useState } from 'react';

const TweetEditor = () => {
  const [tweetContent, setTweetContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);

  const handleContentChange = (e) => {
    setTweetContent(e.target.value);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', tweetContent);
    if (mediaFile) {
      formData.append('media', mediaFile);
    }

    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Tweet créé avec succès !');
        setTweetContent('');
        setMediaFile(null);
      } else {
        console.error('Erreur lors de la création du tweet');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h2>Créer un tweet</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Quoi de neuf ?"
              value={tweetContent}
              onChange={handleContentChange}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              accept="image/*, video/*"
              onChange={handleMediaChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Tweeter
          </button>
        </form>
      </div>
    </div>
  );
};

export default TweetEditor;