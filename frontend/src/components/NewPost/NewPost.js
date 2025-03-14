import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTweet } from "../../services/apiPosts";
import { FiImage, FiXCircle, FiHash } from "react-icons/fi";
import "./NewPost.scss";

// Ajoutez detectedEmotion aux props
const NewPost = ({ onPostCreated, detectedEmotion }) => {
  const [formData, setFormData] = useState({ content: "", media: "" });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [showHashtagInput, setShowHashtagInput] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Extraire les hashtags du contenu quand il change
  useEffect(() => {
    const extractedTags = extractHashtags(formData.content);
    setHashtags(extractedTags);
  }, [formData.content]);

  // Fonction pour extraire les hashtags du texte
  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    
    if (!matches) return [];
    
    return matches.map(tag => tag.slice(1).toLowerCase());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Picture to high ! Max 5MB.");
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

  const handleHashtagInputChange = (e) => {
    // Supprimer le # s'il est ajouté par l'utilisateur
    setNewHashtag(e.target.value.replace(/^#/, ''));
  };

  const handleAddHashtag = () => {
    if (newHashtag.trim() !== "") {
      // Vérifier si le hashtag existe déjà dans le contenu
      if (!hashtags.includes(newHashtag.toLowerCase())) {
        // Ajouter le hashtag au contenu
        const updatedContent = `${formData.content} #${newHashtag}`;
        setFormData({ ...formData, content: updatedContent });
      }
      
      setNewHashtag("");
      setShowHashtagInput(false);
    }
  };

  const handleHashtagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const handleRemoveHashtag = (tagToRemove) => {
    // Remplacer le hashtag dans le contenu
    const updatedContent = formData.content.replace(
      new RegExp(`#${tagToRemove}\\b`, 'g'), 
      ''
    ).replace(/\s+/g, ' ').trim();
    
    setFormData({ ...formData, content: updatedContent });
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

    // Construire l'objet tweet avec userId, l'émotion détectée et les hashtags
    const tweetData = {
      userId: user._id,
      content: formData.content,
      media: formData.media || "",
      hashtags: hashtags,
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
      <h2>Create a new post</h2>
      {error && <p className="error">{error}</p>}
      
      {/* Afficher l'émotion détectée si disponible */}
      {detectedEmotion && (
        <div className="detected-emotion">
          Current emotion detection: <span className="emotion">{detectedEmotion}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          placeholder="What do you want to share ?"
          value={formData.content}
          onChange={handleChange}
          required
        />
        
        {/* Affichage des hashtags */}
        {hashtags.length > 0 && (
          <div className="hashtags-container">
            {hashtags.map((tag, index) => (
              <div key={index} className="hashtag-pill">
                #{tag}
                <button 
                  type="button" 
                  className="remove-hashtag" 
                  onClick={() => handleRemoveHashtag(tag)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Interface d'ajout de hashtag */}
        {showHashtagInput ? (
          <div className="hashtag-input-container">
            <span className="hashtag-prefix">#</span>
            <input
              type="text"
              value={newHashtag}
              onChange={handleHashtagInputChange}
              onKeyDown={handleHashtagKeyDown}
              placeholder="Ajouter un hashtag"
              autoFocus
            />
            <button 
              type="button" 
              className="add-hashtag-btn"
              onClick={handleAddHashtag}
            >
              Add
            </button>
            <button 
              type="button" 
              className="cancel-hashtag-btn"
              onClick={() => {
                setNewHashtag("");
                setShowHashtagInput(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            type="button" 
            className="show-hashtag-input-btn"
            onClick={() => setShowHashtagInput(true)}
          >
            <FiHash className="icon" /> Add hashtag
          </button>
        )}
        
        <div className="media-controls">
          {/* Bouton stylisé pour ajouter une image */}
          <label className="image-upload-btn">
            <FiImage className="icon" />
            Add picture
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        {/* Aperçu de l'image avec possibilité de suppression */}
        {imageFile && (
          <div className="preview">
            <img src={URL.createObjectURL(imageFile)} alt="Preview" />
            <button type="button" className="remove-img" onClick={handleRemoveImage}>
              <FiXCircle />
            </button>
          </div>
        )}

        <button type="submit" className="publish-btn">Publish</button>
      </form>
    </div>
  );
};

export default NewPost;