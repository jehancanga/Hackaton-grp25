// frontend/src/components/EmotionDetector/EmotionDetector.js
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './EmotionDetector.scss';

const EmotionDetector = ({ onEmotionDetected }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Nettoyer les ressources quand le composant est démonté
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsActive(true);
      
      // Commencer à capturer les images toutes les 3 secondes
      intervalRef.current = setInterval(captureAndDetect, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'accès à la webcam:', error);
    }
  };

  const stopWebcam = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !isActive) return;
    
    try {
      // Capturer l'image de la webcam
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convertir l'image en base64
      const imageBase64 = canvas.toDataURL('image/jpeg');
      
      // Envoyer l'image au service Flask
      const response = await axios.post('http://localhost:5000/detect-emotion', {
        image: imageBase64
      });
      
      if (response.data && response.data.emotion) {
        const detectedEmotion = response.data.emotion;
        setCurrentEmotion(detectedEmotion);
        
        // Notifier le composant parent
        if (onEmotionDetected) {
          onEmotionDetected(detectedEmotion);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la détection d\'émotions:', error);
    }
  };

  return (
    <div className="emotion-detector">
      <div className="video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
        />
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="controls">
        {!isActive ? (
          <button onClick={startWebcam} className="start-webcam">
            Activer la webcam
          </button>
        ) : (
          <button onClick={stopWebcam} className="stop-webcam">
            Désactiver la webcam
          </button>
        )}
      </div>
      
      {currentEmotion && (
        <div className="current-emotion">
          Votre humeur: <span className="emotion">{currentEmotion}</span>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;