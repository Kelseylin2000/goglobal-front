import React, { useContext, useState, useRef, useEffect } from 'react';
import '../styles/ChatWindow.css';
import { ChatContext } from '../context/ChatContext';

const ChatWindow = () => {
  const { currentChat, isChatWindowOpen, closeChatWindow, sendMessage } =
    useContext(ChatContext);
  const [messageContent, setMessageContent] = useState('');
  const messageAreaRef = useRef(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [currentChat]);

  if (!isChatWindowOpen || !currentChat) {
    return null;
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(messageContent);
    setMessageContent('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span className="chat-title">{currentChat.friendName}</span>
        <button className="close-chat-button" onClick={closeChatWindow}>
          &times;
        </button>
      </div>
      <div className="message-area" ref={messageAreaRef}>
        {currentChat.messages.map((message, index) => {
          const isSentByUser = message.senderId == userId;
          const messageDate = new Date(message.createdAt);
          const formattedDate = messageDate.toLocaleDateString('zh-TW');
          const formattedTime = messageDate.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={index}
              className={`message-block ${
                isSentByUser ? 'sent-message' : 'received-message'
              }`}
            >
              {!isSentByUser && (
                <img
                  src={`https://i.pravatar.cc/200?u=${currentChat.friendId}`}
                  alt={currentChat.friendName}
                  className="message-friend-avatar"
                />
              )}
              <div className="message-item">
                <div className="message-sender">
                  {message.content}
                </div>
                <div className="message-time">
                  {formattedDate} {formattedTime}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form className="message-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="輸入訊息..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button type="submit">發送</button>
      </form>
    </div>
  );
};

export default ChatWindow;
