import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTweet } from "../../services/apiPosts";
import "./NewPost.scss";

// Ajoutez detectedEmotion aux props
const NewPost = ({ onPostCreated, detectedEmotion }) => {
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

    // Construire l'objet tweet avec userId et l'émotion détectée
    const tweetData = {
      userId: user._id,
      content: formData.content,
      media: formData.media || "",
      detectedEmotion: detectedEmotion || "neutral" // Inclure l'émotion détectée
    };

    console.log("🔍 Données envoyées au backend :", tweetData);

    try {
      const response = await createTweet(tweetData, token);
      if (response) {
        console.log("✅ Tweet créé avec succès :", response);
        
        // Notifier le parent que le post a été créé
        if (onPostCreated) onPostCreated();
        
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
      
      {/* Afficher l'émotion détectée si disponible */}
      {detectedEmotion && (
        <div className="detected-emotion">
          Detection émotion actuelle: <span className="emotion">{detectedEmotion}</span>
        </div>
      )}
      
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