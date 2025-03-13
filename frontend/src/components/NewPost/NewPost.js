import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTweet } from "../../services/apiPosts";
import { FiImage, FiXCircle } from "react-icons/fi";
import "./NewPost.scss";

// Ajoutez detectedEmotion aux props
const NewPost = ({ onPostCreated, detectedEmotion }) => {
  const [formData, setFormData] = useState({ content: "", media: "" });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image est trop grande ! Maximum 5MB autorisé.");
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, media: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData((prev) => ({ ...prev, media: "" }));
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

    try {
      const response = await createTweet(tweetData, token);
      if (response) {
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
        
        {/* Bouton stylisé pour ajouter une image */}
        <label className="image-upload-btn">
          <FiImage className="icon" />
          Ajouter une image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {/* Aperçu de l'image avec possibilité de suppression */}
        {imageFile && (
          <div className="preview">
            <img src={URL.createObjectURL(imageFile)} alt="Preview" />
            <button type="button" className="remove-img" onClick={handleRemoveImage}>
              <FiXCircle />
            </button>
          </div>
        )}

        <button type="submit">Publier</button>
      </form>
    </div>
  );
};

export default NewPost;