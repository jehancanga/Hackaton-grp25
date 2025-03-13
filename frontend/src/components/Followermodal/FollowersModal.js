import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FollowersModal.scss';

// Ajout de refreshStats aux props
const FollowersModal = ({ userId, isOpen, onClose, initialTab = 'followers', refreshStats }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Réinitialiser les données quand le modal s'ouvre ou se ferme
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      fetchData();
    } else {
      // Réinitialiser les états quand le modal se ferme
      setFollowers([]);
      setFollowing([]);
      setError(null);
    }
  }, [isOpen, initialTab, userId]);

  // Charger les données quand l'onglet change
  useEffect(() => {
    if (isOpen && userId) {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    if (!userId) {
      setError("ID utilisateur manquant");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error("Vous n'êtes pas connecté");
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log(`Chargement des ${activeTab} pour l'utilisateur ${userId}`);
      
      const response = await axios.get(`/api/users/${userId}/${activeTab}`, config);
      
      // Vérifier la structure des données
      if (Array.isArray(response.data)) {
        console.log(`Nombre de ${activeTab} reçus:`, response.data.length);
        if (activeTab === 'followers') {
          setFollowers(response.data);
        } else {
          setFollowing(response.data);
        }
      } else {
        console.error("Format de données inattendu:", response.data);
        setError("Format de données incorrect");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      let errorMessage = "Une erreur est survenue";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
        } else {
          errorMessage = `Erreur ${error.response.status}: ${error.response.data?.message || 'Une erreur est survenue'}`;
        }
      } else {
        errorMessage = error.message || "Impossible de contacter le serveur";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour naviguer vers le profil d'un utilisateur

    const navigateToUserProfile = (userId) => {
      // Fermer le modal d'abord
      onClose();
      
      // Appeler refreshStats si disponible
      if (typeof refreshStats === 'function') {
        console.log("📊 Rafraîchissement des statistiques avant navigation...");
        refreshStats();
      }
      
      // Puis naviguer vers la page du profil utilisateur
      navigate(`/profile/${userId}`);
    };

  // Fonction pour gérer la fermeture personnalisée qui rafraîchit les statistiques
  const handleClose = () => {
    // Appeler refreshStats avant de fermer (si disponible)
    if (refreshStats) {
      refreshStats();
    }
    
    // Puis appeler la fonction onClose originale
    onClose();
  };

  // SI le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  return (
    <div className="followers-modal-overlay" onClick={handleClose}>
      <div className="followers-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{activeTab === 'followers' ? 'Abonnés' : 'Abonnements'}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Abonnés
          </button>
          <button 
            className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Abonnements
          </button>
        </div>

        <div className="modal-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : activeTab === 'followers' ? (
            followers.length === 0 ? (
              <div className="empty-message">Aucun abonné pour le moment</div>
            ) : (
              <ul className="users-list">
                {followers.map(user => (
                  <li 
                    key={user._id} 
                    className="user-item"
                    onClick={() => navigateToUserProfile(user._id)}
                  >
                    <img 
                      src={user.profilePic || "https://via.placeholder.com/40"} 
                      alt={user.username} 
                      className="user-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                    <span className="user-name">{user.username}</span>
                  </li>
                ))}
              </ul>
            )
          ) : following.length === 0 ? (
            <div className="empty-message">Vous ne suivez personne pour le moment</div>
          ) : (
            <ul className="users-list">
              {following.map(user => (
                <li 
                  key={user._id} 
                  className="user-item"
                  onClick={() => navigateToUserProfile(user._id)}
                >
                  <img 
                    src={user.profilePic || "https://via.placeholder.com/40"} 
                    alt={user.username} 
                    className="user-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40";
                    }}
                  />
                  <span className="user-name">{user.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
