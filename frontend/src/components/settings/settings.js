import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser, updateUserProfile } from "../../services/apiUsers";
import "./settings.scss";
import FollowersModal from '..//Followermodal/FollowersModal';

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0); 
  const [tweets, setTweets] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [followModalType, setFollowModalType] = useState('followers');
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setUserId(user._id || user.id || "");
          
          const usernameValue = user.username || "";
          setUsername(usernameValue);
          setCurrentUsername(usernameValue);
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
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setProfileImage(base64String);
      };
      
      reader.readAsDataURL(file);
  
      toast.info("Image sélectionnée. N'oubliez pas de sauvegarder pour l'appliquer.", {
        autoClose: 3000,
      });
    }
  };
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
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
      // Construire l'objet JSON avec l'image en Base64
      const data = {
        username: username.trim(),
        bio: bio.trim(),
        profilePic: profileImage,
      };
  
      console.log("📤 Données envoyées en JSON :", data);
  
      const result = await updateUserProfile(data);
  
      console.log("✅ Réponse du serveur :", result);
  
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          username,
          bio,
          profilePic: result.user.profilePic || profileImage,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // Mettre à jour le nom d'utilisateur affiché
      setCurrentUsername(username);
  
      toast.update(loadingToastId, {
        render: "Profil mis à jour avec succès ! ✅",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
  
      // Rechargement de la page après une sauvegarde réussie
      window.location.reload();

    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du profil :", error);
  
      toast.update(loadingToastId, {
        render: error.response?.data?.message || "Erreur lors de la mise à jour du profil",
        type: "error",
        isLoading: false,
        autoClose: 5000,
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

  const handleOpenFollowersModal = () => {
    setFollowModalType('followers');
    setFollowModalVisible(true);
  };
  
  const handleOpenFollowingModal = () => {
    setFollowModalType('following');
    setFollowModalVisible(true);
  };
  
  return (
    <div className="settings-container">
      <div className="profile-header">
        <div className="profile-main">
          <div className="user-profile-info">
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
              </div>
              <label htmlFor="profile-pic" className="edit-icon">
                <svg viewBox="0 0 24 24" className="pencil-icon">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </label>
              <input type="file" id="profile-pic" className="hidden-input" onChange={handleImageChange} accept="image/*" />
            </div>
            <div className="username-display">
              <h2>{currentUsername || "Utilisateur"}</h2>
            </div>
          </div>
        </div>
  
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{tweets}</span>
            <span className="stat-label">Tweets</span>
          </div>
          <div className="stat-item" onClick={handleOpenFollowersModal} style={{cursor: 'pointer'}}>
            <span className="stat-value">{followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item" onClick={handleOpenFollowingModal} style={{cursor: 'pointer'}}>
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
        <form className="settings-form" onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <input 
              type="text" 
              value={username} 
              onChange={handleUsernameChange} 
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
  
      {/* Le modal de followers/following */}
      <FollowersModal 
        userId={userId}
        isOpen={followModalVisible}
        onClose={() => setFollowModalVisible(false)}
        initialTab={followModalType}
      />
    </div>
  );
};

export default ProfileSettings;
