
import React, { useContext, useState, useRef, useEffect } from 'react';
import '../styles/ChatWindow.css';
import { ChatContext } from '../context/ChatContext';

const ChatWindow = () => {
  const { currentChat, isChatWindowOpen, closeChatWindow, sendMessage } =
    useContext(ChatContext);
  const [messageContent, setMessageContent] = useState('');
  const messageAreaRef = useRef(null);

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
        <span className="chat-title">與 {currentChat.friendName} 的聊天室</span>
        <button className="close-chat-button" onClick={closeChatWindow}>
          &times;
        </button>
      </div>
      <div className="message-area" ref={messageAreaRef}>
        {currentChat.messages.map((message, index) => {
            const isSentByUser = message.senderId == localStorage.getItem('userId');
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
                <div className="message-item">
                <div className="message-sender"><b>{isSentByUser ? '你' : currentChat.friendName}:</b> {message.content}</div>
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
