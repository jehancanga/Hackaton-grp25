import React from "react";
import "./Post.scss";

const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="post-header">
        <img src={post.userAvatar} alt="Avatar" className="avatar" />
        <div>
          <h3 className="username">{post.username}</h3>
          <p className="timestamp">{post.timestamp}</p>
        </div>
      </div>
      <p className="content">{post.content}</p>
      {post.image && <img src={post.image} alt="Post" className="post-image" />}
      <div className="post-actions">
        <button>❤️ {post.likes}</button>
        <button>🔄 {post.retweets}</button>
        <button>💬 {post.comments}</button>
      </div>
    </div>
  );
};

export default Post;
