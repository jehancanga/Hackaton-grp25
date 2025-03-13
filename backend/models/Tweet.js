import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 280 },
    media: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hashtag" }],
    category: { type: String, default: "Autre" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;
