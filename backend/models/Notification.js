const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['like', 'retweet', 'reply', 'follow', 'mention', 'emotion_insight'],
    required: true
  },
  tweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  emotionData: {
    emotion: String,
    confidence: Number
  },
  message: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);