import React, { useState, useContext } from 'react';
import { SaveContext } from '../context/SaveContext';
import { ChatContext } from '../context/ChatContext';
import ChatSessionsModal from './ChatSessionsModal';
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate = useNavigate();
  const { toggleSavedPostsModal } = useContext(SaveContext);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const { loadSessions } = useContext(ChatContext);

  const openSessionsModal = () => {
    loadSessions();
    setIsSessionsModalOpen(true);
  };

  const closeSessionsModal = () => {
    setIsSessionsModalOpen(false);
  };

  const goToHome = () => {
    navigate('/');
  };
  return (
    <header>
      <div className="brand" onClick={goToHome} style={{ cursor: 'pointer' }}>
        <h1>Goglobal</h1>
      </div>
      <div className='header-actions'>
        <button className="saved-button" onClick={toggleSavedPostsModal}>
          <img src="/img/saved.png" alt="我的收藏" />
        </button>
        <button className="chat-button" onClick={openSessionsModal}>
          <img src="/img/chat.png" alt="聊天" />
        </button>
      </div>
      {isSessionsModalOpen && (
        <ChatSessionsModal onClose={closeSessionsModal} />
      )}
    </header>
  );
};

export default Header;