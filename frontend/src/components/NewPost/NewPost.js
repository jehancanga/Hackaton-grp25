import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTweet } from "../../services/api";
import "./NewPost.scss";

const NewPost = () => {
  const [formData, setFormData] = useState({ content: "", media: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content) {
      setError("Le texte du post est requis.");
      return;
    }

    const response = await createTweet(formData);
    if (response) {
      navigate("/");
    } else {
      setError("Erreur lors de la création du post.");
    }
  };

  return (
    <div className="newpost-container">
      <h2>Créer un nouveau post</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          placeholder="Que voulez-vous partager ?"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="media"
          placeholder="Lien d'une image/vidéo (facultatif)"
          onChange={handleChange}
        />
        <button type="submit">Publier</button>
      </form>
    </div>
  );
};

export default NewPost;
