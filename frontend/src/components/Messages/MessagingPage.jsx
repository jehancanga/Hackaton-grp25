import React, { useState } from 'react';
import { mockConversations } from '../data/mockMessages';
import MessageList from './MessagesList';
import ChatWindow from './chatWindow';

const MessagingPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h3>Conversations</h3>
          <MessageList
            conversations={mockConversations}
            onSelectConversation={setSelectedConversation}
          />
        </div>
        <div className="col-md-8">
          {selectedConversation ? (
            <ChatWindow conversation={selectedConversation} />
          ) : (
            <div className="text-center mt-5">
              <h4>Sélectionnez une conversation pour commencer à discuter</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;