import React from 'react';

const MessageList = ({ conversations, onSelectConversation }) => {
  return (
    <div className="list-group">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          className="list-group-item list-group-item-action d-flex align-items-center"
          onClick={() => onSelectConversation(conversation)}
        >
          <img
            src={conversation.user.profilePicture}
            alt={conversation.user.name}
            className="rounded-circle me-3"
            style={{ width: '50px', height: '50px' }}
          />
          <div>
            <h6 className="mb-0">{conversation.user.name}</h6>
            <small className="text-muted">
              {conversation.messages[conversation.messages.length - 1].content}
            </small>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MessageList;