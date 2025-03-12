const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 280
  },
  media: [{
    type: String  // URL des médias (images/vidéos)
  }],
  hashtags: [{
    type: String
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  }],
  emotionStats: {
    joy: { type: Number, default: 0 },
    sadness: { type: Number, default: 0 },
    anger: { type: Number, default: 0 },
    surprise: { type: Number, default: 0 },
    disgust: { type: Number, default: 0 },
    fear: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexer pour les recherches rapides
TweetSchema.index({ content: 'text', hashtags: 'text' });

module.exports = mongoose.model('Tweet', TweetSchema);