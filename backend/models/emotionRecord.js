const mongoose = require('mongoose');

const EmotionRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  emotion: {
    type: String,
    enum: ['Joie', 'Tristesse', 'Colère', 'Surprise', 'Dégoût', 'Peur', 'Neutre'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  context: {
    type: String,
    enum: ['browsing', 'watching', 'posting', 'messaging'],
    default: 'browsing'
  }
});

module.exports = mongoose.model('EmotionRecord', EmotionRecordSchema);