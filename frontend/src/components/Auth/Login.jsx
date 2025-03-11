import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour se connecter
    console.log('Email/Pseudo:', emailOrUsername);
    console.log('Mot de passe:', password);
    // Rediriger vers la page d'accueil après la connexion
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="emailOrUsername" className="form-label">
                Email ou Pseudo
              </label>
              <input
                type="text"
                className="form-control"
                id="emailOrUsername"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Se connecter
            </button>
            <div className="mt-3 text-center">
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </div>
            <div className="mt-2 text-center">
              <Link to="/register">Créer un compte</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;