import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FollowersModal.scss";

const FollowersModal = ({ userId, isOpen, onClose, initialTab = "followers" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mettre à jour l'onglet actif lorsqu'il change via les props
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Charger les données lorsque le modal est ouvert ou l'onglet change
  useEffect(() => {
    if (isOpen && userId) {
      fetchData();
    }
  }, [isOpen, userId, activeTab]);

  const fetchData = async () => {
    if (!userId) {
      setError("ID utilisateur manquant");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    console.log(`Chargement des données pour l'onglet ${activeTab}, userId: ${userId}`);
    
    try {
      const endpoint = activeTab === "followers" 
        ? `/api/users/${userId}/followers`
        : `/api/users/${userId}/following`;
      
      console.log(`Appel API: ${endpoint}`);
      const response = await axios.get(endpoint);
      console.log(`Réponse API (${activeTab}):`, response);
      
      const userData = response.data;
      
      if (!userData) {
        throw new Error("Données vides reçues de l'API");
      }
      
      if (Array.isArray(userData)) {
        if (activeTab === "followers") {
          setFollowers(userData);
          console.log(`${userData.length} followers chargés`);
        } else {
          setFollowing(userData);
          console.log(`${userData.length} followings chargés`);
        }
      } else {
        console.error("Format de données inattendu:", userData);
        throw new Error("Format de données inattendu: les données ne sont pas un tableau");
      }
    } catch (err) {
      console.error(`Erreur lors du chargement des ${activeTab}:`, err);
      setError(`Impossible de charger les ${activeTab === "followers" ? "abonnés" : "abonnements"}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    if (!userId || !targetUserId) return;
    
    try {
      console.log(`Tentative de follow/unfollow de l'utilisateur: ${targetUserId}`);
      await axios.post(`/api/users/follow/${targetUserId}`);
      console.log("Action follow/unfollow réussie");
      
      // Mise à jour des données après l'action
      fetchData();
    } catch (err) {
      console.error("Erreur lors du follow/unfollow:", err);
      setError(`Erreur: ${err.message}`);
    }
  };

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  // Déterminer quelles données afficher
  const displayData = activeTab === "followers" ? followers : following;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{activeTab === "followers" ? "Abonnés" : "Abonnements"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === "followers" ? "active" : ""}`}
            onClick={() => setActiveTab("followers")}
          >
            Abonnés
          </button>
          <button 
            className={`tab-btn ${activeTab === "following" ? "active" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            Abonnements
          </button>
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="loading-spinner">Chargement...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : displayData.length > 0 ? (
            <ul className="user-list">
              {displayData.map((user) => (
                <li key={user._id || `user-${Math.random()}`} className="user-item">
                  <div className="user-info">
                    <img 
                      src={user.profilePic || "https://via.placeholder.com/40"} 
                      alt={`Avatar de ${user.username}`} 
                      className="user-avatar" 
                    />
                    <div className="user-details">
                      <span className="user-name">{user.username}</span>
                      {user.bio && <p className="user-bio">{user.bio.substring(0, 50)}{user.bio.length > 50 ? "..." : ""}</p>}
                    </div>
                  </div>
                  {userId !== (user._id || user.id) && (
                    <button 
                      className={`follow-btn ${user.isFollowedByMe ? "unfollow" : ""}`}
                      onClick={() => handleFollow(user._id || user.id)}
                    >
                      {user.isFollowedByMe ? "Ne plus suivre" : "Suivre"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-message">
              {activeTab === "followers" ? "Aucun abonné" : "Aucun abonnement"}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="fermer-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
