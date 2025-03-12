import React, { useState } from 'react';
import './User.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('tweets'); // État pour gérer l'onglet actif

  // Données mockées pour le profil utilisateur
  const user = {
    name: 'Aymane Hajli',
    username: '@aymanehj',
    bio: 'Développeur passionné par React et Node.js',
    profilePicture: 'https://via.placeholder.com/150',
    banner: 'https://via.placeholder.com/1200x400',
    tweetsCount: 120,
    followersCount: 500,
    followingCount: 300,
    tweets: [
      { id: 1, content: 'Ceci est un tweet mocké !', likes: 10, retweets: 2, comments: 3 },
      { id: 2, content: 'Un autre tweet pour tester.', likes: 5, retweets: 1, comments: 0 },
    ],
    media: [
      { id: 1, type: 'image', url: 'https://via.placeholder.com/300' },
      
    ],
    likedTweets: [
      { id: 3, content: 'Un tweet que j\'ai aimé.', likes: 15, retweets: 3, comments: 5 },
    ],
  };

  return (
    <div className="container mt-4">
      {/* Bannière et photo de profil */}
      <div className="card">
        <img src={user.banner} className="card-img-top" alt="Bannière" style={{ height: '200px', objectFit: 'cover' }} />
        <div className="card-body text-center">
          <img
            src={user.profilePicture}
            alt="Photo de profil"
            className="rounded-circle mb-3"
            style={{ width: '100px', height: '100px', marginTop: '-50px', border: '3px solid white' }}
          />
          <h2>{user.name}</h2>
          <p className="text-muted">{user.username}</p>
          <p>{user.bio}</p>
          <div className="d-flex justify-content-center gap-4">
            <div>
              <strong>{user.tweetsCount}</strong>
              <span className="text-muted"> Tweets</span>
            </div>
            <div>
              <strong>{user.followersCount}</strong>
              <span className="text-muted"> Abonnés</span>
            </div>
            <div>
              <strong>{user.followingCount}</strong>
              <span className="text-muted"> Abonnements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets de navigation */}
      <ul className="nav nav-tabs mt-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'tweets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tweets')}
          >
            Tweets
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            Médias
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'likes' ? 'active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            J'aime
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Abonnés/Abonnements
          </button>
        </li>
      </ul>

      {/* Contenu des onglets */}
      <div className="mt-3">
        {activeTab === 'tweets' && (
          <div>
            <h3>Publications personnelles</h3>
            {user.tweets.map((tweet) => (
              <div key={tweet.id} className="card mb-3">
                <div className="card-body">
                  <p>{tweet.content}</p>
                  <div className="d-flex gap-3">
                    <span>❤️ {tweet.likes}</span>
                    <span>🔁 {tweet.retweets}</span>
                    <span>💬 {tweet.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            <h3>Médias partagés</h3>
            <div className="row">
              {user.media.map((item) => (
                <div key={item.id} className="col-md-4 mb-3">
                  {item.type === 'image' ? (
                    <img src={item.url} alt="Média" className="img-fluid" />
                  ) : (
                    <iframe
                      src={item.url}
                      title="Vidéo"
                      className="w-100"
                      style={{ height: '200px' }}
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'likes' && (
          <div>
            <h3>Tweets aimés</h3>
            {user.likedTweets.map((tweet) => (
              <div key={tweet.id} className="card mb-3">
                <div className="card-body">
                  <p>{tweet.content}</p>
                  <div className="d-flex gap-3">
                    <span>❤️ {tweet.likes}</span>
                    <span>🔁 {tweet.retweets}</span>
                    <span>💬 {tweet.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'followers' && (
          <div>
            <h3>Abonnés et Abonnements</h3>
            <div className="row">
              <div className="col-md-6">
                <h4>Abonnés</h4>
                <ul className="list-group">
                  {/* Afficher la liste des abonnés */}
                  <li className="list-group-item">Utilisateur 1</li>
                  <li className="list-group-item">Utilisateur 2</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h4>Abonnements</h4>
                <ul className="list-group">
                  {/* Afficher la liste des abonnements */}
                  <li className="list-group-item">Utilisateur 3</li>
                  <li className="list-group-item">Utilisateur 4</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;