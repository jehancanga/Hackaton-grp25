import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTweet } from "../../services/apiPosts";
import "./NewPost.scss";

const NewPost = () => {
  const [formData, setFormData] = useState({ content: "", media: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Récupérer l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      setError("Le texte du post est requis.");
      return;
    }

    if (!user) {
      setError("Vous devez être connecté pour poster.");
      return;
    }

    // Construire l'objet tweet avec userId
    const tweetData = {
      userId: user._id, // On récupère l'ID utilisateur
      content: formData.content,
      media: formData.media || "", // Optionnel
    };

    // 🚀 LOG pour vérifier les données avant l'envoi
    console.log("🔍 Données envoyées au backend :", tweetData);

    try {
      const response = await createTweet(tweetData, token);
      if (response) {
        console.log("✅ Tweet créé avec succès :", response);
        navigate("/");
      } else {
        setError("Erreur lors de la création du post.");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la publication du tweet :", err);
      setError("Impossible de publier le post.");
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
