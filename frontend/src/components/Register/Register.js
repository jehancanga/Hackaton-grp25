import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/apiUsers";
import "./Register.scss";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Données envoyées :", formData); // Vérification des données envoyées
    const data = await registerUser(formData);
    if (data) {
      navigate("/login");
    } else {
      setError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Créer un compte</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Pseudo" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
