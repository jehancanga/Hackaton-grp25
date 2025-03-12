import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/apiUsers";
import "./Login.scss";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Données envoyées :", formData);

    const data = await loginUser(formData);
    if (data) {
      console.log("✅ Réponse du serveur :", data);
      console.log("🔑 Token reçu :", data.token);
      console.log("👤 Utilisateur connecté :", data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
      window.location.reload();
    } else {
      console.error("❌ Échec de la connexion : Email ou mot de passe incorrect.");
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Se connecter</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
        <button type="submit">Connexion</button>
      </form>
    </div>
  );
};

export default Login;
