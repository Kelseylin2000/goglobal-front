import React, { useState, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { phaseMapping } from '../utils/constants';

import { useNavigate } from 'react-router-dom';

const SimpleUserProfileInfo = ({ profile }) => {
  const { acceptFriendRequest, sendFriendRequest, rejectFriendRequest } = useContext(ChatContext);
  const { userId: currentUserId } = useContext(AuthContext);    
  const { setSameSchoolUserProfiles } = useContext(UserContext);

  const navigate = useNavigate();

  const {
    userId,
    name,
    phase,
    originSchoolName,
    exchangeSchoolName,
    mutualInterests,
    mutualFriends,
    relationship,
  } = profile;

  const updateRelationship = (newRelationship) => {
    setSameSchoolUserProfiles((prevProfiles) =>
      prevProfiles.map((p) =>
        p.userId === userId
          ? { ...p, relationship: newRelationship }
          : p
      )
    );
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
              onClick={(e) => {
                e.stopPropagation();
                acceptFriendRequest(currentUserId, userId, profile);
                updateRelationship('FRIENDS');
              }}
            >
              確認好友邀請
            </button>
            <button
              className="reject-button"
              onClick={(e) => {
                e.stopPropagation();
                rejectFriendRequest(profile);
                updateRelationship('NO_RELATION');
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
            onClick={(e) => {
              e.stopPropagation();
              sendFriendRequest(currentUserId, userId);
              updateRelationship('FRIEND_REQUEST_SENT');
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
    <div className="simple-user-profile-info"
        onClick={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
            navigate(`/user/${userId}`);
        }}>

    <div className='post-header'>
      <img 
          src={`https://i.pravatar.cc/200?u=${userId}`}
          alt="Avatar"
        />
        <div className="author-info">
      <h3>{name || 'User'}</h3>

        {/* 顯示階段、原學校、交換學校 */}
        <div className="profile-details">
            <p className="phase">{phase ? phaseMapping[phase] : '未設定階段'}</p>
            <p className="origin-school">{originSchoolName ? originSchoolName : '未設定原學校'}</p>
            <span className="profile-details-arrow">▶</span>
            <p className="exchange-school">{exchangeSchoolName ? exchangeSchoolName : '?'}</p>
        </div>
      </div>
    </div>

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

    </div>
  );
};

export default SimpleUserProfileInfo;