
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { getUserPosts } from '../utils/api';
import PostList from '../components/PostList';
import UserProfileInfo from '../components/UserProfileInfo';

const UserProfilePage = () => {
  const { userId } = useParams();
  const { meUserProfile, otherUserProfile, fetchUserProfile } = useContext(UserContext);
  const { userId: currentUserId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  const isCurrentUser = Number(userId) === Number(currentUserId);
  const profile = isCurrentUser ? meUserProfile : otherUserProfile;

  useEffect(() => {
    if (!isCurrentUser) {
      fetchUserProfile(userId);
    }
    fetchUserPostsData(userId);
    // eslint-disable-next-line
  }, [userId]);

  const fetchUserPostsData = async (userId) => {
    try {
      const response = await getUserPosts(userId);
      setPosts(response.data);
    } catch (error) {
      console.error('獲取用戶 post 時出錯:', error);
    }
  };

  if (!profile) {
    return <div>載入中...</div>;
  }

  return (
    <div>
      <UserProfileInfo profile={profile} isCurrentUser={isCurrentUser} />
      <PostList posts={posts} />
    </div>
  );
};

export default UserProfilePage;
