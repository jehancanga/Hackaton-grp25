import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "./public/Images/defaultuser.jpg" },
    bio: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAdmin: { type: Boolean, default: false },
    bannerPic: { type: String, default: "https://via.placeholder.com/800x200" },
    blockedUsers: {type: [mongoose.Schema.Types.ObjectId],ref: "User",default: [],},
    tweetCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔐 Hacher le mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Vérifier le mot de passe
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
