import { useState } from 'react';

const Settings = () => {
  const [accountPreferences, setAccountPreferences] = useState({
    language: 'fr',
    theme: 'light',
  });

  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    showActivityStatus: true,
  });

  const [personalizationSettings, setPersonalizationSettings] = useState({
    personalizedAds: true,
    recommendations: true,
  });

  const [emotionalAnalysisSettings, setEmotionalAnalysisSettings] = useState({
    optIn: false,
  });

  const handleAccountPreferencesChange = (e) => {
    const { name, value } = e.target;
    setAccountPreferences({
      ...accountPreferences,
      [name]: value,
    });
  };

  const handlePrivacySettingsChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings({
      ...privacySettings,
      [name]: checked,
    });
  };

  const handlePersonalizationSettingsChange = (e) => {
    const { name, checked } = e.target;
    setPersonalizationSettings({
      ...personalizationSettings,
      [name]: checked,
    });
  };

  const handleEmotionalAnalysisSettingsChange = (e) => {
    const { checked } = e.target;
    setEmotionalAnalysisSettings({
      optIn: checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez envoyer les paramètres mis à jour au backend
    console.log('Préférences de compte:', accountPreferences);
    console.log('Confidentialité et sécurité:', privacySettings);
    console.log('Personnalisation de l\'expérience:', personalizationSettings);
    console.log('Analyse émotionnelle:', emotionalAnalysisSettings);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Paramètres</h1>
      <form onSubmit={handleSubmit}>
        {/* Section Préférences de compte */}
        <div className="card mb-4">
          <div className="card-header">
            <h2>Préférences de compte</h2>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="language" className="form-label">
                Langue
              </label>
              <select
                className="form-select"
                id="language"
                name="language"
                value={accountPreferences.language}
                onChange={handleAccountPreferencesChange}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="theme" className="form-label">
                Thème
              </label>
              <select
                className="form-select"
                id="theme"
                name="theme"
                value={accountPreferences.theme}
                onChange={handleAccountPreferencesChange}
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Confidentialité et sécurité */}
        <div className="card mb-4">
          <div className="card-header">
            <h2>Confidentialité et sécurité</h2>
          </div>
          <div className="card-body">
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="privateAccount"
                name="privateAccount"
                checked={privacySettings.privateAccount}
                onChange={handlePrivacySettingsChange}
              />
              <label htmlFor="privateAccount" className="form-check-label">
                Rendre mon compte privé
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="showActivityStatus"
                name="showActivityStatus"
                checked={privacySettings.showActivityStatus}
                onChange={handlePrivacySettingsChange}
              />
              <label htmlFor="showActivityStatus" className="form-check-label">
                Afficher mon statut d'activité
              </label>
            </div>
          </div>
        </div>

        {/* Section Personnalisation de l'expérience */}
        <div className="card mb-4">
          <div className="card-header">
            <h2>Personnalisation de l'expérience</h2>
          </div>
          <div className="card-body">
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="personalizedAds"
                name="personalizedAds"
                checked={personalizationSettings.personalizedAds}
                onChange={handlePersonalizationSettingsChange}
              />
              <label htmlFor="personalizedAds" className="form-check-label">
                Publicités personnalisées
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="recommendations"
                name="recommendations"
                checked={personalizationSettings.recommendations}
                onChange={handlePersonalizationSettingsChange}
              />
              <label htmlFor="recommendations" className="form-check-label">
                Recommandations personnalisées
              </label>
            </div>
          </div>
        </div>

        {/* Section Analyse émotionnelle */}
        <div className="card mb-4">
          <div className="card-header">
            <h2>Analyse émotionnelle</h2>
          </div>
          <div className="card-body">
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="emotionalAnalysis"
                name="emotionalAnalysis"
                checked={emotionalAnalysisSettings.optIn}
                onChange={handleEmotionalAnalysisSettingsChange}
              />
              <label htmlFor="emotionalAnalysis" className="form-check-label">
                Activer l'analyse émotionnelle
              </label>
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;