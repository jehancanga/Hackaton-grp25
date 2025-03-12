import React, { useState } from "react";
import Post from "../Post/Post";
import "./Feed.scss";

const Feed = () => {
  const [posts] = useState([
    {
      id: 1,
      username: "Lyra",
      userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX5BBn2NvVcHouuDLpiDfaGhztRETO7O12Cw&s",
      timestamp: "1h ago",
      content: "Hello world! This is my first post 🚀",
      image: "",
      likes: 12,
      retweets: 5,
      comments: 3,
    },
    {
      id: 2,
      username: "Alice",
      userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX5BBn2NvVcHouuDLpiDfaGhztRETO7O12Cw&s",
      timestamp: "2h ago",
      content: "Loving the new platform! What do you guys think? 🤔",
      image: "",
      likes: 34,
      retweets: 8,
      comments: 10,
    },
    {
      id: 3,
      username: "Bob",
      userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX5BBn2NvVcHouuDLpiDfaGhztRETO7O12Cw&s",
      timestamp: "3h ago",
      content: "Check out this cool picture I took! 📸",
      image: "",
      likes: 21,
      retweets: 7,
      comments: 4,
    },
  ]);

  return (
    <div className="feed">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
