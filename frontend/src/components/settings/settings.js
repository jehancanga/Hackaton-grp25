import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser, updateUserProfile } from "../../services/apiUsers";
import "./settings.scss";

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

  useEffect(() => {
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
        } else {
          toast.info("Veuillez vous connecter pour voir votre profil");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement du profil");
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
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="profile-header">
        <div className="profile-main">
          <div className="profile-image-container">
            <img src={userData.profilePic} alt="Profile" className="profile-image" />
            <input type="file" id="profile-pic" className="hidden-input" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
          </div>
          <h2>{userData.username || "Utilisateur"}</h2>
          <p>{userData.bio}</p>
        </div>

        <div className="profile-stats">
          <span>{userData.tweets} Tweets</span>
          <span>{userData.followers} Followers</span>
          <span>{userData.following} Following</span>
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
    </div>
  );
};

export default ProfileSettings;
