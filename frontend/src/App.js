import Feed from './components/Feed';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Settings from './components/Settings/Settings';
import UserProfile from './components/User/UserProfile';
import MessagingPage from './components/Messages/MessagingPage';
import Navbar from './components/navbar/navbar';
import 'bootstrap/dist/js/bootstrap.bundle.min';



function App() {



  return (

    
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<UserProfile />} /> 
        <Route path="/messaging" element={<MessagingPage />} />
        <Route path="/" element={<Feed />} /> {/* Page principale */}
      </Routes>
    </Router>
  );
}

export default App
