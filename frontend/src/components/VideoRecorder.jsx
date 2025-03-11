import React, { useState, useRef } from 'react';

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        setVideoBlob(e.data);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (videoBlob) {
      const formData = new FormData();
      formData.append('video', videoBlob, 'video.mp4');

      try {
        const response = await fetch('/api/tweets', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('Vidéo téléversée avec succès !');
          setVideoBlob(null);
        } else {
          console.error('Erreur lors du téléversement de la vidéo');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h2>Enregistrer une vidéo</h2>
      </div>
      <div className="card-body">
        <video ref={videoRef} controls className="w-100 mb-3"></video>
        <div className="d-flex gap-2">
          <button
            className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement'}
          </button>
          {videoBlob && (
            <button className="btn btn-success" onClick={handleSubmit}>
              Téléverser la vidéo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;