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

  const toggleSessionsModal = () => {
    if (isSessionsModalOpen) {
      setIsSessionsModalOpen(false);
    } else {
      loadSessions();
      setIsSessionsModalOpen(true);
      setIsFriendsModalOpen(false);
    }
  };

  const toggleFriendsModal = () => {
    setIsFriendsModalOpen(!isFriendsModalOpen); // 切換好友 modal 狀態
    setIsSessionsModalOpen(false);
  };

  const goToHome = () => {
    navigate('/');
  };

  const goToConnection = () => {
    navigate('/find-partner');
  };

  const goToUserProfile = () => {
    if (meUserProfile) {
      navigate(`/user/${meUserProfile.userId}`);
    }
  };

  return (
    <header>
      <div className="brand" onClick={goToHome} style={{ cursor: 'pointer' }}>
        <img src="/img/GoGlobal.png" alt="GoGlobal" />
      </div>
      <div className="header-nav">
        <button onClick={goToHome} style={{ cursor: 'pointer' }}>
          <p>找資訊</p>
        </button>
        <button onClick={goToConnection} style={{ cursor: 'pointer' }}>
          <p>找夥伴</p>
        </button>
      </div>
      <div className='header-right'>
        <div className="header-actions">
          <button className="saved-button" onClick={toggleSavedPostsModal}>
            <img src="/img/b-saved.png" alt="我的收藏" />
          </button>
          <button className="chat-button" onClick={toggleSessionsModal}>
            <img src="/img/b-chat.png" alt="聊天" />
          </button>
          <button className="friends-button" onClick={toggleFriendsModal}>
            <img src="/img/b-friends.png" alt="好友" />
          </button>
        </div>
        {meUserProfile &&(
          <button className="user-button" onClick={goToUserProfile}>
              <img src={`https://i.pravatar.cc/200?u=${meUserProfile.userId}`} alt="使用者" />
          </button>
        )}
      </div>
      {isSessionsModalOpen && (
        <ChatSessionsModal onClose={toggleSessionsModal} />
      )}
      {isSavedModalOpen && (
        <SavedPostsModal
          savedPosts={savedPosts}
          toggleSavedPostsModal={toggleSavedPostsModal}
          userId={userId}
        />
      )}
      {isFriendsModalOpen && (
        <FriendsModal onClose={toggleFriendsModal} />
      )}
    </header>
  );
};

export default Header;
