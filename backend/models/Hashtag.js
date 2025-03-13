import mongoose from "mongoose";

const hashtagSchema = new mongoose.Schema(
  {
    hashtag: { type: String, required: true, unique: true },
    category: { type: String, required: true }, // Ajout de la catégorie
    tweetCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);
export default Hashtag;
