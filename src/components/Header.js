import React, { useState, useContext, useEffect, useRef } from 'react';
import { SaveContext } from '../context/SaveContext';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { searchPosts } from '../utils/api';
import { useLocation } from 'react-router-dom';

import ChatSessionsModal from './ChatSessionsModal';
import SavedPostsModal from '../components/SavedPostsModal';
import FriendsModal from '../components/FriendsModal';

const Header = () => {
  const navigate = useNavigate();
  const { toggleSavedPostsModal, savedPosts, isSavedModalOpen } = useContext(SaveContext);
  const { meUserProfile, userId } = useContext(UserContext);

  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();  // 用來監聽路由變化
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 檢查點擊是否在下拉選單或搜尋欄外
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // 監聽全局點擊事件
    document.addEventListener('mousedown', handleClickOutside);

    // 清除事件監聽器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    setSearchKeyword('');  // 每次路由變化時清空搜尋欄
    setSearchResults([]);
    setIsDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    if(searchResults.length > 0 && searchKeyword !== ''){
      setIsDropdownOpen(true);
    }
  }, [searchResults]);

  const toggleSessionsModal = () => {
    setIsSessionsModalOpen((prev) => !prev);
    setIsFriendsModalOpen(false);
  };

  const toggleFriendsModal = () => {
    setIsFriendsModalOpen((prev) => !prev);
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (value) {
      debounceSearch(value);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    // 檢查是否處於組合輸入階段（選字階段）
    if (e.isComposing || e.keyCode === 229) {
      // 如果處於選字階段，則不進行搜尋操作
      return;
    }
  
    // 如果按下 Enter 並且搜尋欄位中有內容，進行搜尋
    if (e.key === 'Enter' && searchKeyword.trim() !== '') {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };  

  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debounceSearch = debounce(async (keyword) => {
    if(searchKeyword !== ''){
      const results = await searchPosts(keyword);
      setSearchResults(results.data);
    }
  }, 300);



  const handleSelectPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const extractSummary = (content, keyword) => {
    const sentences = content.match(/[^，。！？,\.!\?]+[，。！？,\.!\?]+/g) || [content];
  
    if (sentences.length > 3) {
      // 查找包含關鍵字的句子
      const keywordIndex = sentences.findIndex(sentence =>
        sentence.includes(keyword)
      );
  
      // 如果找到了關鍵字
      if (keywordIndex !== -1) {
        const firstSentence = sentences[0];
        const secondSentence = sentences[1];
        const lastSentence = sentences[sentences.length - 1];
  
        // 如果關鍵字在前兩句或最後一句中，按原樣返回摘要
        if (keywordIndex === 0 || keywordIndex === 1 || keywordIndex === sentences.length - 1) {
          return `${firstSentence} ${secondSentence} ... ${lastSentence}`;
        }
  
        // 如果關鍵字在其他地方，返回第一句、關鍵字句子和最後一句
        return `${firstSentence} ... ${sentences[keywordIndex]} ... ${lastSentence}`;
      }
    }
  
    // 如果句子少於三句，或者關鍵字未找到，返回整個內容
    return content;
  };

  const highlightMatch = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part === keyword ? (
        <span key={index} className="highlighted">{part}</span>
      ) : (
        part
      )
    );
  };  

  const renderSummaryWithHighlight = (content, keyword) => {
    const summary = extractSummary(content, keyword);
    return highlightMatch(summary, keyword);
  };

  return (
    <header>
      <div className="header-left">
        <div className="brand" onClick={goToHome} style={{ cursor: 'pointer' }}>
          <img src="/img/GoGlobal.png" alt="GoGlobal" />
        </div>
        <div className="search-bar">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="搜尋貼文內容..."
          />
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="autocomplete-dropdown" ref={dropdownRef}>
              {searchResults.map((post) => (
                <div
                  key={post.postId}
                  className="autocomplete-item"
                  onClick={() => handleSelectPost(post.postId)}
                >
                  <p>{renderSummaryWithHighlight(post.content, searchKeyword)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-nav">
          <button onClick={goToHome} style={{ cursor: 'pointer' }}>
            <p>找資訊</p>
          </button>
          <button onClick={goToConnection} style={{ cursor: 'pointer' }}>
            <p>找夥伴</p>
          </button>
        </div>
      </div>
      <div className="header-right">
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
        {meUserProfile && (
          <button className="user-button" onClick={goToUserProfile}>
            <img src={`https://i.pravatar.cc/200?u=${meUserProfile.userId}`} alt="使用者" />
          </button>
        )}
      </div>
      {isSessionsModalOpen && <ChatSessionsModal onClose={toggleSessionsModal} />}
      {isSavedModalOpen && (
        <SavedPostsModal
          savedPosts={savedPosts}
          toggleSavedPostsModal={toggleSavedPostsModal}
          userId={userId}
        />
      )}
      {isFriendsModalOpen && <FriendsModal onClose={toggleFriendsModal} />}
    </header>
  );
};

export default Header;
