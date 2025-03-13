import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser, updateUserProfile } from "../../services/apiUsers";
import "./settings.scss";

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState(0); // Initialiser à 0 au lieu de null
  const [following, setFollowing] = useState(0); // Initialiser à 0 au lieu de null
  const [tweets, setTweets] = useState(0); // Initialiser à 0 au lieu de null
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const user = getCurrentUser();
        if (user) {
          setUsername(user.username || "");
          setBio(user.bio || "");
          
          // Récupération des compteurs, en s'assurant qu'ils ne sont jamais null ou undefined
          const followersCount = Array.isArray(user.followers) 
            ? user.followers.length 
            : (typeof user.followers === 'number' ? user.followers : 0);
            
          const followingCount = Array.isArray(user.following) 
            ? user.following.length 
            : (typeof user.following === 'number' ? user.following : 0);
            
          const tweetsCount = Array.isArray(user.tweets) 
            ? user.tweets.length 
            : (typeof user.tweets === 'number' ? user.tweets : 0);
          
          setFollowers(followersCount);
          setFollowing(followingCount);
          setTweets(tweetsCount);
          
          setProfileImage(user.profilePic || "https://via.placeholder.com/150");
        } else {
          console.log("Aucun utilisateur trouvé dans le localStorage");
          toast.info("Veuillez vous connecter pour voir votre profil");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données de profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    
    // Nettoyage des ressources blob au démontage
    return () => {
      if (profileImage && profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("L'image est trop grande ! Maximum 5 MB autorisé.");
        return;
      }

      setProfileImageFile(file);
      
      // Utilisation de FileReader au lieu de URL.createObjectURL
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);

      toast.info("Image sélectionnée. N'oubliez pas de sauvegarder pour l'appliquer.", {
        autoClose: 3000
      });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      toast.error("Vous devez être authentifié pour mettre à jour votre profil");
      return;
    }

    const loadingToastId = toast.loading("Mise à jour de votre profil...");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const result = await updateUserProfile(formData);
      console.log("Résultat de la mise à jour:", result);

      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          username,
          bio,
          profilePic: result.profilePic || profileImage
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.update(loadingToastId, {
        render: "Profil mis à jour avec succès ! ✅",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      window.location.reload();
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du profil :", error);

      toast.update(loadingToastId, {
        render: error.response?.data?.message || "Erreur lors de la mise à jour du profil",
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    } finally {
      setIsLoading(false);
    }
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
            <div className="profile-image">
              <img 
                src={profileImage} 
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
              <label htmlFor="profile-pic" className="edit-icon">
                <svg viewBox="0 0 24 24" className="pencil-icon">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </label>
              <input type="file" id="profile-pic" className="hidden-input" onChange={handleImageChange} accept="image/*" />
            </div>
          </div>
        </div>

        {/* Section des stats modifiée pour garantir zéro en cas d'absence de valeur */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{tweets}</span>
            <span className="stat-label">Tweets</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab-button ${activeTab === 0 ? "active" : ""}`} onClick={() => setActiveTab(0)}>
          Profil
        </button>
        <button className={`tab-button ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>
          Sécurité
        </button>
      </div>

      {activeTab === 0 && (
        <form className="settings-form" onSubmit={handleProfileUpdate} encType="multipart/form-data">
          <div className="form-group">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nom d'utilisateur" className="input-field" />
          </div>
          <div className="form-group">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ma bio" className="input-field bio-field" rows={4} />
          </div>
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
          </button>
        </form>
      )}

      {activeTab === 1 && (
        <form className="settings-form" onSubmit={handlePasswordUpdate}>
          <div className="form-group">
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Mot de passe actuel" className="input-field" />
          </div>
          <div className="form-group">
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" className="input-field" />
          </div>
          <div className="form-group">
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmer le mot de passe" className="input-field" />
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
