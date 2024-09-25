import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { getUserPosts } from '../utils/api';
import PostList from '../components/PostList';
import UserProfileInfo from '../components/UserProfileInfo';

const UserProfilePage = () => {
  const { userId } = useParams(); // URL 中的 userId
  const { meUserProfile, otherUserProfile, fetchUserProfile } = useContext(UserContext); // 從 UserContext 獲取當前使用者和其他使用者資料
  const { userId: currentUserId, token } = useContext(AuthContext); // 當前登入者的 userId
  const [posts, setPosts] = useState([]);

  const isCurrentUser = Number(userId) === Number(currentUserId); // 檢查是否是當前使用者
  const profile = isCurrentUser ? meUserProfile : otherUserProfile; // 決定顯示哪個使用者資料

  useEffect(() => {
    if (!isCurrentUser) {
      fetchUserProfile(userId); // 如果不是當前使用者，抓取指定用戶的資料
    }
    fetchUserPostsData(userId); // 抓取指定用戶的發文
    // eslint-disable-next-line
  }, [userId]);

  const fetchUserPostsData = async (userId) => {
    try {
      const response = await getUserPosts(userId, token);
      setPosts(response.data);
    } catch (error) {
      console.error('獲取用戶 post 時出錯:', error);
    }
  };

  if (!profile) {
    return <div>載入中...</div>;
  }

  return (
    <main>
      <UserProfileInfo profile={profile} isCurrentUser={isCurrentUser} />
      <PostList 
        posts={posts}
        userId={currentUserId}
       />
    </main>
  );
};

export default UserProfilePage;
