import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser, updateUserProfile } from "../../services/apiUsers";
import "./settings.scss";
import FollowersModal from '../Followermodal/FollowersModal';

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState({
    username: "",
    bio: "",
    profilePic: "",
    followers: 0,
    following: 0,
    tweets: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState("Neutre");
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [currentUsername, setCurrentUsername] = useState("");
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [followModalType, setFollowModalType] = useState('followers');
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Vérifier l'authentification au chargement
    if (!isAuthenticated()) {
      toast.error("Veuillez vous connecter pour accéder à vos paramètres");
      // Rediriger vers la page de connexion
      window.location.href = '/login';
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const user = getCurrentUser();
        if (user) {
          setUserData({
            username: user.username || "",
            bio: user.bio || "",
            profilePic: user.profilePic || "https://via.placeholder.com/150",
            followers: user.followers?.length || 0,
            following: user.following?.length || 0,
            tweets: user.tweets?.length || 0,
          });
          console.log("✅ Utilisateur récupéré:", user);
          setCurrentUser(user);
          
          // S'assurer que l'ID utilisateur est bien défini
          const userIdValue = user._id || user.id || "";
          console.log("👤 ID utilisateur:", userIdValue);
          
          if (!userIdValue) {
            console.warn("⚠️ ID utilisateur manquant dans les données utilisateur");
          }
          
          setUserId(userIdValue);
          
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
          // Redirection vers la page de connexion si aucun utilisateur
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement du profil");
        console.error("❌ Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données de profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 📸 Gérer l'activation/désactivation de la caméra
  const toggleCamera = async () => {
    if (!cameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraActive(true);

          // ✅ Affiche la notif SEULEMENT si elle n'a pas été affichée avant
          toast.dismiss();  // Supprime toutes les anciennes notifications
          toast.success("Caméra activée avec succès !");
        } else {
          throw new Error("Flux vidéo introuvable");
        }
      } catch (error) {
        console.error("🚨 Erreur lors de l'activation de la caméra :", error);

        // ✅ Vérifie si l'utilisateur a explicitement refusé
        if (error.name === "NotAllowedError") {
          toast.error("Accès à la caméra refusé. Vérifiez les permissions.");
        }
      }
    } else {
      // ✅ Désactive proprement la caméra et vide la source vidéo
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);

      // ✅ Supprime toute ancienne notification et affiche un message propre
      toast.dismiss();
      toast.info("Caméra désactivée.");
    }
  };



  // 🎭 Détection d'émotion via la caméra (Envoi image au backend Flask)
  const sendImageToEmotionAI = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob);
      formData.append("user_id", getCurrentUser()?._id);

      try {
        const response = await fetch("http://localhost:5000/api/emotions/predict", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setEmotion(data.emotion);
        toast.info(`Émotion détectée : ${data.emotion}`);
      } catch (error) {
        console.error("Erreur lors de l'analyse de l'émotion :", error);
      }
    }, "image/jpeg");
  };

  // 📤 Mettre à jour le profil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      username: userData.username.trim(),
      bio: userData.bio.trim(),
      profilePic: userData.profilePic,
    };

    try {
      await updateUserProfile(data);
      toast.success("Profil mis à jour avec succès !");
      window.location.reload();
  
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
      toast.error("Erreur lors de la mise à jour du profil.");
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
    // Vérifier que l'utilisateur est authentifié avant d'ouvrir le modal
    if (!isAuthenticated()) {
      toast.error("Vous devez être connecté pour voir vos abonnés");
      return;
    }
    
    // Vérifier que l'ID utilisateur existe
    if (!userId) {
      console.error("❌ Impossible d'ouvrir le modal: ID utilisateur manquant");
      toast.error("Une erreur est survenue. Veuillez rafraîchir la page.");
      return;
    }
    
    console.log("🔍 Ouverture du modal des abonnés pour l'utilisateur:", userId);
    setFollowModalType('followers');
    setFollowModalVisible(true);
  };
  
  const handleOpenFollowingModal = () => {
    // Vérifier que l'utilisateur est authentifié avant d'ouvrir le modal
    if (!isAuthenticated()) {
      toast.error("Vous devez être connecté pour voir vos abonnements");
      return;
    }
    
    // Vérifier que l'ID utilisateur existe
    if (!userId) {
      console.error("❌ Impossible d'ouvrir le modal: ID utilisateur manquant");
      toast.error("Une erreur est survenue. Veuillez rafraîchir la page.");
      return;
    }
    
    console.log("🔍 Ouverture du modal des abonnements pour l'utilisateur:", userId);
    setFollowModalType('following');
    setFollowModalVisible(true);
  };
  
  return (
    <div className="settings-container">
      <div className="profile-header">
        <div className="profile-main">
          <div className="profile-image-container">
            <img src={userData.profilePic} alt="Profile" className="profile-image" />
            <input type="file" id="profile-pic" className="hidden-input" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
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
          <h2>{userData.username || "Utilisateur"}</h2>
          <p>{userData.bio}</p>
        </div>
  
        <div className="profile-stats">
          <span>{userData.tweets} Tweets</span>
          <span>{userData.followers} Followers</span>
          <span>{userData.following} Following</span>
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
        <button className={`tab-button ${activeTab === 0 ? "active" : ""}`} onClick={() => setActiveTab(0)}>Profil</button>
        <button className={`tab-button ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>Sécurité</button>
        <button className={`tab-button ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>Caméra IA</button>
      </div>
  
      {activeTab === 0 && (
        <form className="settings-form" onSubmit={handleProfileUpdate}>
          <input type="text" value={userData.username} onChange={e => setUserData({ ...userData, username: e.target.value })} placeholder="Nom d'utilisateur" />
          <textarea value={userData.bio} onChange={e => setUserData({ ...userData, bio: e.target.value })} placeholder="Ma bio" rows={4} />
          <button type="submit" disabled={isLoading}>{isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}</button>
        </form>
      )}
  
      {activeTab === 1 && (
        <form className="settings-form">
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Mot de passe actuel" />
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmer le mot de passe" />
          <button type="submit">Mettre à jour</button>
        </form>
      )}

      {activeTab === 2 && (
        <div className="camera-section">
          <button onClick={toggleCamera}>{cameraActive ? "Désactiver la caméra" : "Activer la caméra"}</button>
          {cameraActive && <video ref={videoRef} autoPlay playsInline />}
          {cameraActive && <button onClick={sendImageToEmotionAI}>Analyser l'émotion</button>}
          <p>Émotion détectée : {emotion}</p>
        </div>
      )}
  
      {/* Ne montrer le modal que si userId existe et que le modal est visible */}
      {userId && followModalVisible && (
        <FollowersModal 
          userId={userId}
          isOpen={followModalVisible}
          onClose={() => setFollowModalVisible(false)}
          initialTab={followModalType}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
