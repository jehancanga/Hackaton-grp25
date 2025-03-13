import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTweet } from "../../services/apiPosts";
import { FiImage, FiXCircle, FiHash } from "react-icons/fi";
import "./NewPost.scss";

const NewPost = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({ content: "", media: "", hashtags: "" });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    let { name, value } = e.target;
  
    if (name === "hashtags") {
      // Séparer en cas de virgule et ajouter "#" devant si absent
      value = value
        .split(",")
        .map(tag => tag.trim())  // Supprime les espaces inutiles
        .map(tag => (tag.startsWith("#") ? tag : `#${tag}`)) // Ajoute `#` si absent
        .join(", "); // Reformate en string pour l'affichage dans le champ
  
      console.log(`📌 Mise à jour du champ ${name} :`, value);
    }
  
    setFormData({ ...formData, [name]: value });
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
  
    // ✅ Corrige la séparation des hashtags en tableau
    const hashtagsArray = formData.hashtags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith("#") && tag.length > 1);
  
    console.log("📤 Hashtags traités :", hashtagsArray);
  
    const tweetData = {
      userId: user._id,
      content: formData.content,
      media: formData.media || "",
      hashtags: hashtagsArray
    };
  
    console.log("📤 Données envoyées :", tweetData);
  
    try {
      const response = await createTweet(tweetData, token);
  
      console.log("✅ Réponse reçue du backend :", response);
  
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
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          placeholder="Que voulez-vous partager ?"
          onChange={handleChange}
          required
        />

        {/* Champ pour ajouter des hashtags */}
        <div className="hashtag-input">
          <FiHash className="icon" />
          <input
            type="text"
            name="hashtags"
            placeholder="Ajouter des hashtags (séparés par des virgules)"
            value={formData.hashtags} // ✅ Corrige ici pour bien lier le state
            onChange={handleChange}
          />
        </div>

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
