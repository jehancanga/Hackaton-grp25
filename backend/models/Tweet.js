import mongoose from "mongoose";

// Update the tweet schema to include category and detectedEmotion fields

const tweetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 280 },
    media: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    category: { type: String, enum: [
      "Technology", "Science", "Sports", "Entertainment", "Politics", 
      "Health", "Education", "Business", "Travel", "Food", 
      "Fashion", "Music", "Art", "Gaming", "Environment", "Uncategorized"
    ], default: "Uncategorized" },
    detectedEmotion: { type: String, enum: ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"], default: "neutral" }
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;