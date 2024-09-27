import React, { useState, useContext } from 'react';

import { SaveContext } from '../context/SaveContext';
import { ChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

import ChatSessionsModal from './ChatSessionsModal';
import SavedPostsModal from '../components/SavedPostsModal';
import FriendsModal from '../components/FriendsModal';

const Header = () => {
  const navigate = useNavigate();
  const { toggleSavedPostsModal, savedPosts, isSavedModalOpen } = useContext(SaveContext);
  const { loadSessions } = useContext(ChatContext);
  const { meUserProfile, userId } = useContext(UserContext);

  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);

  const openSessionsModal = () => {
    loadSessions();
    setIsSessionsModalOpen(true);
  };

  const closeSessionsModal = () => {
    setIsSessionsModalOpen(false);
  };

  const openFriendsModal = () => {
    setIsFriendsModalOpen(true); // 打開好友 modal
  };

  const closeFriendsModal = () => {
    setIsFriendsModalOpen(false); // 關閉好友 modal
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
        <button className="friends-button" onClick={openFriendsModal}>
          <img src="/img/friends.png" alt="好友" />
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
      {isFriendsModalOpen && (
        <FriendsModal onClose={closeFriendsModal} />
      )}
    </header>
  );
};

export default Header;