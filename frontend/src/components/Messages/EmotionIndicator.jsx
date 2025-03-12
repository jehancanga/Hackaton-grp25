import React from 'react';

const EmotionIndicator = ({ emotion }) => {
  const getEmoji = () => {
    switch (emotion) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'angry':
        return '😠';
      case 'excited':
        return '😃';
      default:
        return '😐';
    }
  };

  return <span className="ms-2">{getEmoji()}</span>;
};

export default EmotionIndicator;