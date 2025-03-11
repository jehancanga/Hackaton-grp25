import React from 'react';

const HashtagsSection = ({ hashtags }) => (
  <div className="hashtags">
    <h3>Hashtags consultés</h3>
    <ul>
      {hashtags.map(hashtag => (
        <li key={hashtag}>#{hashtag}</li>
      ))}
    </ul>
  </div>
);

export default HashtagsSection;