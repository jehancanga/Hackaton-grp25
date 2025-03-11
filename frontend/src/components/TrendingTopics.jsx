import React from 'react';

const TrendingTopics = ({ topics }) => {
  return (
    <div className="trending-topics">
      <h3>Trending Topics</h3>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>
            <span className="trending-rank">#{index + 1}</span>
            <span className="trending-name">{topic.name}</span>
            <span className="trending-count">{topic.count} tweets</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingTopics;