import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header/Header";
import Feed from "./components/Feed/Feed";
import EmotionFeed from "./components/EmotionFeed/EmotionFeed";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import NewPost from "./components/NewPost/NewPost";
import MyPosts from "./components/MyPosts/MyPosts";
import Settings from "./components/settings/settings";
import ProfilUser from "./components/profilUser/profilUser";
import EmotionDetector from "./components/EmotionDetector/EmotionDetector";
import RecommendedFeed from "./components/RecommendedFeed/RecommendedFeed";
import './App.css';

function App() {
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  
  const handleEmotionDetected = (emotion) => {
    setDetectedEmotion(emotion);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <>
              <EmotionDetector onEmotionDetected={handleEmotionDetected} />
              
              {/* Main content */}
              <div className="main-container">
                {detectedEmotion && <RecommendedFeed emotion={detectedEmotion} />}
                <Feed />
              </div>
            </>
          } />
          
          {/* Nouvelle route pour EmotionFeed */}
          <Route path="/emotions" element={
            <>
              <EmotionDetector onEmotionDetected={handleEmotionDetected} />
              <div className="main-container">
                <EmotionFeed initialEmotion={detectedEmotion} />
              </div>
            </>
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/newpost" element={
            <NewPost detectedEmotion={detectedEmotion} />
          } />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/:userId" element={<ProfilUser />} />
        </Routes>
 
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;