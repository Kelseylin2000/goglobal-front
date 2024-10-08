import React, { useContext } from 'react';
import '../styles/SideModal.css';
import { ChatContext } from '../context/ChatContext';

const ChatSessionsModal = ({ onClose }) => {
  const { chatSessions, openChatWindow } = useContext(ChatContext);
  const userId = localStorage.getItem('userId');
  return (
    <div className="side-modal">
        <div className="session-list">
          {chatSessions.length === 0 ? (
            <div className="no-sessions-message">
              <p>目前還沒有聊天記錄，</p>
              <p>快去找尋夥伴聊聊吧！</p>
            </div>
          ) : (
            chatSessions.map((session) => {
              const friendId = session.participants.find((id) => id != userId);
              const friendName =
                session.participantsName[
                  session.participants.indexOf(friendId)
                ];
              
                let createdAt = session.latestMessage.createdAt;

                if (!createdAt.endsWith('Z')) {
                  createdAt += 'Z';
                }

                const latestMessageDate = new Date(createdAt).toLocaleDateString();
                const latestMessageTime = new Date(createdAt).toLocaleTimeString([], {
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
                    <div className="session-main">
                      <img className="session-img" src={`https://i.pravatar.cc/200?u=${friendId}`}></img>
                      <div className="session-details">
                        <div className="participant-name">{friendName}</div>
                        <div className="latest-message">
                        {session.latestMessage.content}
                        </div>
                      </div>
                    </div>
                    <div className="session-time">
                        <span>{latestMessageDate}</span> <span>{latestMessageTime}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
    </div>
  );
};

export default ChatSessionsModal;
