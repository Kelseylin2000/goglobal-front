import React, { useContext } from 'react';
import '../styles/ChatSessionsModal.css';
import { ChatContext } from '../context/ChatContext';

const ChatSessionsModal = ({ onClose }) => {
  const { chatSessions, openChatWindow } = useContext(ChatContext);
  const userId = localStorage.getItem('userId');

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal-content sessions-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>聊天列表</h2>

        <div className="session-list">
          {chatSessions.length === 0 ? (
            <div className="no-sessions-message">
              目前還沒有聊天記錄，快去找尋夥伴聊聊吧！
            </div>
          ) : (
            chatSessions.map((session) => {
              const friendId = session.participants.find((id) => id != userId);
              const friendName =
                session.participantsName[
                  session.participants.indexOf(friendId)
                ];

              const latestMessageDate = new Date(
                session.latestMessage.createdAt
              ).toLocaleDateString('zh-TW');
              const latestMessageTime = new Date(
                session.latestMessage.createdAt
              ).toLocaleTimeString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={session.chatId}
                  className="session-item"
                  onClick={() => {
                    openChatWindow(session.chatId, friendId);
                    onClose();
                  }}
                >
                  <div className="session-details-container">
                    <div className="session-details">
                      <div className="participant-name">{friendName}</div>
                      <div className="latest-message">
                      {session.latestMessage.content}
                      </div>
                    </div>
                    <div className="session-time">
                        {latestMessageDate} {latestMessageTime}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSessionsModal;
