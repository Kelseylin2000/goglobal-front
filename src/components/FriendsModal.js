import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import {phaseMapping} from '../utils/constants';

const FriendsModal = ({ onClose }) => {
  const { friends, pendingRequests, acceptFriendRequest, rejectFriendRequest } = useContext(ChatContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends'); // 預設顯示好友列表
const { userId: currentUserId } = useContext(AuthContext); // 當前登入者的 userId

  const renderFriendInfo = (friend, isRequest = false) => {
    return (
    <div 
        className="post-header"
        key={friend.userId}
        onClick={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
            //   setIsSavedModalOpen(false); 
            navigate(`/user/${friend.userId}`);
      }}>
          <img
            src={`https://i.pravatar.cc/200?u=${friend.userId}`}
            alt="Avatar"
          />
        <div className="author-info">
            <h3>{friend.name}</h3>
              <div className="profile-details">
                <p className="phase">{friend.phase ? phaseMapping[friend.phase] : '未設定階段'}</p>

                {['APPLYING', 'ADMITTED', 'STUDYING_ABROAD', 'RETURNED'].includes(friend.phase) && (
                  <>
                    <p className="origin-school">{friend.originSchoolName ? friend.originSchoolName : '未設定原學校'}</p>
                    <span className='profile-details-arrow'>▶</span>
                    <p className="exchange-school">{friend.exchangeSchoolName ? friend.exchangeSchoolName : '?'}</p>
                  </>
                )}
            </div>
          </div>
        
        {isRequest && ( // 只有在好友請求的情況下才顯示按鈕
          <div className="request-buttons">
            <button 
              className="accept-button"
              onClick={(e) => {
                e.stopPropagation();
                acceptFriendRequest(currentUserId, friend.userId, friend); // 這裡傳遞了用戶ID
              }}
            >
              確認
            </button>
            <button 
              className="reject-button"
              onClick={(e) => {
                e.stopPropagation();
                rejectFriendRequest(friend); // 拒絕好友請求
              }}
            >
              刪除
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="modal friends-modal">
      <div className="modal-header">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>好友</h2>
      </div>
      <div className="modal-content">
        <div className="tab-buttons">
          <button
            className={`friends-tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            好友列表
          </button>
          <button
            className={`requests-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            收到的好友請求
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'friends' && (
            <div className="friends-list">
              {friends && friends.length > 0 ? (
                friends.map(friend => renderFriendInfo(friend))
              ) : (
                <p>目前沒有好友。</p>
              )}
            </div>
          )}
          {activeTab === 'requests' && (
            <div className="friend-requests">
              {pendingRequests && pendingRequests.length > 0 ? (
                pendingRequests.map(request => renderFriendInfo(request, true)) // 第二個參數用來標記這是好友請求
              ) : (
                <p>目前沒有收到好友請求。</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
