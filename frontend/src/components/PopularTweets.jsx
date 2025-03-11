import React from 'react';
import Tweet from './Tweet';

const PopularTweets = ({ tweets }) => (
  <div className="popular-tweets">
    <h3>Tweets populaires</h3>
    {tweets.map(tweet => (
      <Tweet key={tweet.id} tweet={tweet} />
    ))}
  </div>
);

export default PopularTweets;