import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import UserProfileInfo from '../components/UserProfileInfo';

const UserProfilePage = () => {
  const { userId } = useParams();

  const { meUserProfile, otherUserProfile, setOtherUserProfile, fetchUserProfile } = useContext(UserContext);
  const { userId: currentUserId, token} = useContext(AuthContext);
  const { mePosts, otherUserPosts, setOtherUserPosts, fetchUserPostsData} = useContext(PostContext);

  const [isPostFormVisible, setIsPostFormVisible] = useState(false);

  const isCurrentUser = Number(userId) === Number(currentUserId);
  const profile = isCurrentUser ? meUserProfile : otherUserProfile;
  const posts =  isCurrentUser ? mePosts : otherUserPosts;


  useEffect(() => {
    if (!isCurrentUser) {
      setOtherUserProfile([]);
      setOtherUserPosts([]);
      
      fetchUserProfile(userId);
      fetchUserPostsData(userId);
    }
    // eslint-disable-next-line
  }, [userId]);

  const togglePostForm = () => {
    setIsPostFormVisible(!isPostFormVisible);
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
       {isCurrentUser && (
        <div className="side-div">
          <img src='/img/earth-write.jpg'></img>
          <button className="new-post-button" onClick={togglePostForm}>
            新增貼文
          </button>
        </div>
       )}

        {isPostFormVisible && (
          <PostForm
            onClose={togglePostForm}
          />
        )}
    </main>
  );
};

export default UserProfilePage;
