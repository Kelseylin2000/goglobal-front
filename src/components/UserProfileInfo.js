import React, { useState, useContext } from 'react';
import EditProfileModal from './EditProfileModal';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { phaseMapping } from '../utils/constants';

const UserProfileInfo = ({ profile, isCurrentUser }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 控制編輯模態框狀態
  const { acceptFriendRequest, sendFriendRequest, rejectFriendRequest } = useContext(ChatContext);
  const { userId: currentUserId } = useContext(AuthContext); // 當前登入者的 userId
  const { setOtherUserProfile } = useContext(UserContext); // 從 UserContext 獲取當前使用者和其他使用者資料


  const {
    userId,
    name,
    phase,
    introduction,
    originSchoolName,
    exchangeSchoolName,
    interests,
    mutualInterests,
    mutualFriends,
    relationship,
  } = profile;

  const openEditModal = () => {
    setIsEditModalOpen(true); // 打開編輯模態框
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false); // 關閉編輯模態框
  };

  const renderRelationshipAction = () => {
    switch (relationship) {
      case 'FRIENDS':
        return <p className="relationship-status relationship-status-friend">好友</p>;
  
      case 'FRIEND_REQUEST_SENT':
        return <p className="relationship-status relationship-status-sent">交友邀請已發送</p>;
  
      case 'FRIEND_REQUEST_RECEIVED':
        return (
          <div className="request-actions">
            <button
              className="accept-button"
              onClick={() => {
                acceptFriendRequest(currentUserId, userId, profile);
                setOtherUserProfile((prevProfile) => ({
                  ...prevProfile,
                  relationship: 'FRIENDS',
                }));
              }}
            >
              確認好友邀請
            </button>
            <button
              className="reject-button"
              onClick={() => {
                rejectFriendRequest(profile);
                setOtherUserProfile((prevProfile) => ({
                  ...prevProfile,
                  relationship: 'NO_RELATION',
                }));
              }}
            >
              刪除好友邀請
            </button>
          </div>
        );
  
      case 'NO_RELATION':
        return (
          <button
            className="send-request-button"
            onClick={() => {
              sendFriendRequest(currentUserId, userId);
              setOtherUserProfile((prevProfile) => ({
                ...prevProfile,
                relationship: 'FRIEND_REQUEST_SENT',
              }));
            }}
          >
            發送交友邀請
          </button>
        );
  
      default:
        return null;
    }
  };
  

  return (
    <div className="user-profile-info">
      <img 
          src={`https://i.pravatar.cc/200?u=${userId}`}
          alt="Avatar"
        />
      <h2>{name || 'User'}</h2>

      {/* 顯示階段、原學校、交換學校 */}
      <div className="profile-details">
          <p className="phase">{phase ? phaseMapping[phase] : '未設定階段'}</p>
          
          {['APPLYING', 'ADMITTED', 'STUDYING_ABROAD', 'RETURNED'].includes(phase) && (
            <>
              <p className="origin-school">{originSchoolName ? originSchoolName : '未設定原學校'}</p>
              <span className='profile-details-arrow'>▶</span>
              <p className="exchange-school">{exchangeSchoolName ? exchangeSchoolName : '?'}</p>
            </>
          )}
        </div>

      {introduction && <p>{introduction}</p>}

      {/* 渲染興趣 */}
      {interests && interests.length > 0 && (
        <div className="user-interests user-interests-main">
          {interests.map((interest, index) => (
            <span key={index} className="interest-tag">{interest}</span>
          ))}
        </div>
      )}

      {/* 渲染共同興趣和共同好友 */}
      {((mutualInterests && mutualInterests.length > 0) || (mutualFriends && mutualFriends.length > 0)) && (
        <div className="mutual-info">

          {mutualFriends && mutualFriends.length > 0 && (
            <div className="user-interests">
              {mutualFriends.length} 位共同好友
              {mutualFriends.map((mutualFriend, index) => (
                <span key={index} className="interest-tag">{mutualFriend}</span>
              ))}
            </div>
          )}

          {mutualInterests && mutualInterests.length > 0 && (
            <div className="user-interests">
              {mutualInterests.length} 項共同興趣
              {mutualInterests.map((mutualInterest, index) => (
                <span key={index} className="interest-tag">{mutualInterest}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 渲染好友關係按鈕或狀態 */}
      <div className="relationship-actions">{renderRelationshipAction()}</div>

      {/* 如果是當前使用者，顯示編輯按鈕 */}
      {isCurrentUser && (
        <div className="profile-actions">
          <button onClick={openEditModal}>
            <img src="/img/edit.png" alt="編輯" />
          </button>
        </div>
      )}

      {/* 渲染編輯模態框 */}
      {isEditModalOpen && (
        <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} />
      )}
    </div>
  );
};

export default UserProfileInfo;
