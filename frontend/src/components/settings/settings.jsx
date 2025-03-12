import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./settings.scss";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des données lors de la navigation depuis la fenêtre précédente
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      try {
        // Simuler un appel API
        // Les données seront obtenues quand l'utilisateur cliquera sur le bouton profil précédemment
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      toast.success("Photo de profil mise à jour !");
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success("Profil mis à jour avec succès !");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    toast.success("Mot de passe mis à jour avec succès !");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="settings-container">
      <div className="profile-header">
        <div className="profile-main">
          <div className="profile-image-container">
            <div className="profile-image" style={{ backgroundImage: `url(${profileImage})` }}>
              <label htmlFor="profile-pic" className="edit-icon">
                <svg viewBox="0 0 24 24" className="pencil-icon">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </label>
              <input type="file" id="profile-pic" className="hidden-input" onChange={handleImageChange} accept="image/*" />
            </div>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{tweets || 0}</span>
            <span className="stat-label">Tweets</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{followers || 0}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{following || 0}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 0 ? "active" : ""}`}
          onClick={() => setActiveTab(0)}
        >
          Profil
        </button>
        <button 
          className={`tab-button ${activeTab === 1 ? "active" : ""}`}
          onClick={() => setActiveTab(1)}
        >
          Sécurité
        </button>
      </div>

      {activeTab === 0 && (
        <form className="settings-form" onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Nom d'utilisateur"
              className="input-field"
            />
          </div>
          <div className="form-group">
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Ma bio"
              className="input-field bio-field" 
              rows={4}
            />
          </div>
          <button type="submit" className="save-button">
            Sauvegarder
          </button>
        </form>
      )}

      {activeTab === 1 && (
        <form className="settings-form" onSubmit={handlePasswordUpdate}>
          <div className="form-group">
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Mot de passe actuel" 
              className="input-field"
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe" 
              className="input-field"
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe" 
              className="input-field"
            />
          </div>
          <button type="submit" className="save-button">
            Mettre à jour le mot de passe
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileSettings;