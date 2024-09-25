import React, { useState, useContext } from 'react';

import { SaveContext } from '../context/SaveContext';
import { ChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

import ChatSessionsModal from './ChatSessionsModal';
import SavedPostsModal from '../components/SavedPostsModal';

const Header = () => {
  const navigate = useNavigate();
  const { toggleSavedPostsModal, savedPosts, isSavedModalOpen } = useContext(SaveContext);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const { loadSessions } = useContext(ChatContext);
  const { meUserProfile, userId } = useContext(UserContext);

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

  const goToUserProfile = () => {
    if (meUserProfile) {
      navigate(`/user/${meUserProfile.userId}`);
    }
  };

  return (
    <header>
      <div className="brand" onClick={goToHome} style={{ cursor: 'pointer' }}>
        <h1>Goglobal</h1>
      </div>
      <div className='header-actions'>
        {meUserProfile && <p>你好，{meUserProfile.name}</p>}
        <button className="saved-button" onClick={toggleSavedPostsModal}>
          <img src="/img/saved.png" alt="我的收藏" />
        </button>
        <button className="chat-button" onClick={openSessionsModal}>
          <img src="/img/chat.png" alt="聊天" />
        </button>
        <button className="user-button" onClick={goToUserProfile}>
          <img src="/img/user.png" alt="使用者" />
        </button>
      </div>
      {isSessionsModalOpen && (
        <ChatSessionsModal onClose={closeSessionsModal} />
      )}
      {isSavedModalOpen && (
        <SavedPostsModal
          savedPosts={savedPosts}
          toggleSavedPostsModal={toggleSavedPostsModal}
          userId={userId}
        />
      )}
    </header>
  );
};

export default Header;