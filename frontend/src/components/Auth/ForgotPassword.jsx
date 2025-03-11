import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour réinitialiser le mot de passe
    console.log('Email:', email);
    // Rediriger vers la page de connexion après la réinitialisation
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Récupération de mot de passe</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Envoyer le lien de réinitialisation
            </button>
            <div className="mt-3 text-center">
              <Link to="/login">Retour à la connexion</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;