import { useState } from 'react';

const ToggleButton = ({ label, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="mb-4">
      <button
        className={`btn ${isVisible ? 'btn-danger' : 'btn-primary'}`}
        onClick={toggleVisibility}
      >
        {isVisible ? `Masquer ${label}` : `Afficher ${label}`}
      </button>
      {isVisible && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default ToggleButton;