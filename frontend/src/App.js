import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header/Header";
import Feed from "./components/Feed/Feed";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import NewPost from "./components/NewPost/NewPost";
import Settings from "./components/settings/settings";
import ProfilUser from "./components/profilUser/profilUser";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/myposts" element={<h1>My Posts</h1>} />
          <Route path="/mypage" element={<h1>My Page</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profil/:userId" element={<ProfilUser />} />
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
