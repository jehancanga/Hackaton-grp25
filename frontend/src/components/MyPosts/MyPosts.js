import React, { useState, useEffect } from "react";
import Post from "../Post/Post";
import { getUserTweets } from "../../services/apiPosts";
import "./MyPosts.scss";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); // Récupération de l'utilisateur connecté

  useEffect(() => {
    if (!user) {
      setError("Utilisateur non connecté.");
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const userPosts = await getUserTweets(user._id);
        if (userPosts) {
          setPosts(userPosts);
        } else {
          setError("Impossible de charger les posts.");
        }
      } catch (err) {
        setError("Erreur de récupération des posts.");
      }
      setLoading(false);
    };

    fetchPosts();
  }, [user]);

  return (
    <div className="myposts">
      <h2>Mes Publications</h2>
      {loading && <p>Chargement des posts...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && posts.length === 0 && <p>Aucun post trouvé.</p>}
      <div className="post-list">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
