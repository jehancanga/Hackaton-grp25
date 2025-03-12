import React, { useState } from 'react';
import EmotionIndicator from './EmotionIndicator';
import MessageInput from './MessageInput';

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState(conversation.messages);

  const handleSendMessage = (newMessage) => {
    const message = {
      id: messages.length + 1,
      senderId: 101, // ID de l'utilisateur actuel (mocké)
      content: newMessage,
      timestamp: new Date().toISOString(),
      emotion: 'neutral', // Émotion par défaut
    };
    setMessages([...messages, message]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>{conversation.user.name}</h5>
      </div>
      <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 ${message.senderId === 101 ? 'text-end' : 'text-start'}`}
          >
            <div
              className={`p-2 rounded ${
                message.senderId === 101 ? 'bg-primary text-white' : 'bg-light'
              }`}
              style={{ maxWidth: '70%', display: 'inline-block' }}
            >
              <p className="mb-0">{message.content}</p>
              <small className="text-muted">
                {new Date(message.timestamp).toLocaleTimeString()}
              </small>
              <EmotionIndicator emotion={message.emotion} />
            </div>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;