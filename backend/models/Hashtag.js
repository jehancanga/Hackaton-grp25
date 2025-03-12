import mongoose from "mongoose";

const hashtagSchema = new mongoose.Schema(
  {
    hashtag: { type: String, required: true, unique: true },
    tweetCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);
export default Hashtag;
