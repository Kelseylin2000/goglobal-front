import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext'; 
import { PostContext } from '../context/PostContext'; 
import { AuthContext } from '../context/AuthContext'; 

import { interestsOptions } from '../utils/constants';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { userId: currentUserId } = useContext(AuthContext);
  const { meUserProfile, updateUserProfile } = useContext(UserContext);
  const { setMePosts, setPosts } = useContext(PostContext);

  const [name, setName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    if (meUserProfile) {
      setName(meUserProfile.name || '');
      setIntroduction(meUserProfile.introduction || '');
      setSelectedInterests(meUserProfile.interests || []);
    }
  }, [meUserProfile]);

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProfileString = { name, introduction, interests: selectedInterests };

    const interestsAsNumbers = selectedInterests.map(
      (interest) => interestsOptions.indexOf(interest) + 1 // 將興趣轉換為對應的數字
    );
    const updatedProfileInt = { 
      name, 
      introduction, 
      interests: interestsAsNumbers // 將數字傳遞給後端
    };

    updateUserProfile(updatedProfileString, updatedProfileInt).then(() => {
      setPosts((prevPosts) => 
        prevPosts.map((post) => 
          post.userId == currentUserId ? { ...post, name: updatedProfileString.name } : post
        )
      );
  
      setMePosts((prevMePosts) =>
        prevMePosts.map((post) => 
          post.userId == currentUserId ? { ...post, name: updatedProfileString.name } : post
        )
      );
    }).catch((error) => {
      console.error("更新個人資料時出錯:", error);
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>編輯個人資料</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="輸入你的姓名"
          />
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className="textarea-field"
            placeholder="介紹一下你自己，讓大家更了解你吧！"
          />
          <div className="tag-selection">
            {interestsOptions.map((interest) => (
              <button
                key={interest}
                className={
                  selectedInterests.includes(interest) ? 'selected' : ''
                }
                onClick={() => handleInterestToggle(interest)}
                type="button"
              >
                {interest}
              </button>
            ))}
          </div>

          <div className="submit-button-container">
            <button type="submit" className="btn-primary">保存變更</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
