import React, { useState, useEffect } from "react";
import Post from "../Post/Post";
import { getUserTweets } from "../../services/apiPosts";
import "./MyPosts.scss";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterHashtag, setFilterHashtag] = useState("");
  const [availableHashtags, setAvailableHashtags] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

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
          
          // Extraire tous les hashtags uniques des posts
          const allHashtags = new Set();
          userPosts.forEach(post => {
            if (post.hashtags && Array.isArray(post.hashtags)) {
              post.hashtags.forEach(tag => allHashtags.add(tag));
            }
          });
          
          setAvailableHashtags(Array.from(allHashtags));
        } else {
          setError("Impossible de charger les posts.");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur de récupération des posts.");
      }
      setLoading(false);
    };

    fetchPosts();
  }, [user]);

  const handleFilterChange = (hashtag) => {
    setFilterHashtag(hashtag === filterHashtag ? "" : hashtag);
  };

  // Filtrer les posts en fonction du hashtag sélectionné
  const filteredPosts = filterHashtag 
    ? posts.filter(post => 
        post.hashtags && 
        Array.isArray(post.hashtags) && 
        post.hashtags.includes(filterHashtag)
      )
    : posts;

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (deletedPostId) => {
    setPosts(prev => prev.filter(post => post._id !== deletedPostId));
  };

  return (
    <div className="myposts">
      <h2>Mes Publications</h2>
      
      {loading && <p className="loading-text">Load posts...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && !error && availableHashtags.length > 0 && (
        <div className="hashtag-filters">
          <h3>Filter by hashtag:</h3>
          <div className="hashtag-pills">
            {availableHashtags.map(tag => (
              <button
                key={tag}
                className={`hashtag-pill ${filterHashtag === tag ? 'active' : ''}`}
                onClick={() => handleFilterChange(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
          {filterHashtag && (
            <button className="clear-filter" onClick={() => setFilterHashtag("")}>
              Remove filter
            </button>
          )}
        </div>
      )}
      
      {!loading && !error && filteredPosts.length === 0 && (
        <p className="no-posts">
          {filterHashtag 
            ? `Aucun post trouvé avec le hashtag #${filterHashtag}.` 
            : "Aucun post trouvé."}
        </p>
      )}
      
      <div className="post-list">
        {filteredPosts.map((post) => (
          <Post 
            key={post._id} 
            post={post} 
            onUpdate={handlePostUpdate}
            onDelete={handlePostDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MyPosts;