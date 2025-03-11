import Feed from './components/Feed';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Settings from './components/Settings/Settings';
import UserProfile from './components/User/UserProfile';
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<UserProfile />} /> 
        <Route path="/" element={<Feed />} /> {/* Page principale */}
      </Routes>
    </Router>
  );
}

export default App
