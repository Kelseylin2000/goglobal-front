import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import {phaseMapping} from '../utils/constants';

const UserProfileInfo = ({ profile, isCurrentUser }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 控制編輯模態框狀態

  const {
    name,
    phase,
    introduction,
    originSchoolName,
    exchangeSchoolName,
    interests,
    mutualInterests,
    mutualFriends
  } = profile;

  const openEditModal = () => {
    setIsEditModalOpen(true); // 打開編輯模態框
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false); // 關閉編輯模態框
  };

  console.log("otherUserProfile");
  console.log(profile);

  return (
    <div className="user-profile-info">
      <h2>{name}</h2>
      
      {/* 將階段、原學校、交換學校顯示在同一行 */}
      <div className="profile-details">
        <p className="phase">{phase ? phaseMapping[phase] : '未設定階段'}</p>
        <p className="origin-school">{originSchoolName ? originSchoolName : '未設定原學校'}</p>
        <span className='profile-details-arrow'>▶</span>
        <p className="exchange-school"> {exchangeSchoolName ? exchangeSchoolName : '未設定目的學校'}</p>
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

    { ((mutualInterests && mutualInterests.length > 0) || (mutualFriends && mutualFriends.length))  && (<div className='mutual-info'>
    {mutualInterests && mutualInterests.length > 0 && (
        <div className="user-interests">
            {mutualInterests.length} 項共同興趣 
            {mutualInterests.map((mutualInterest, index) => (
            <span key={index} className="interest-tag">{mutualInterest}</span>
            ))}
        </div>
    )}  

    {mutualFriends && mutualFriends.length > 0 && (
        <div className="user-interests">
            {mutualFriends.length} 位共同好友 
            {mutualFriends.map((mutualFriend, index) => (
            <span key={index} className="interest-tag">{mutualFriend}</span>
            ))}
        </div>
    )} 
    </div>)}
      
      {isCurrentUser && (
        <div className="profile-actions">
          <button onClick={openEditModal}>
            <img src="/img/edit.png" alt="編輯" />
          </button>
        </div>
      )}

      {/* 渲染 EditProfileModal */}
      {isEditModalOpen && (
        <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} />
      )}
    </div>
  );
};

export default UserProfileInfo;