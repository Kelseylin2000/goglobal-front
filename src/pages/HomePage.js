import React, { useContext, useState } from 'react';

import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';

import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { token, userId } = useContext(AuthContext);
  const { posts } = useContext(PostContext);

  const [loading, setLoading] = useState(false);
  const [isPostFormVisible, setIsPostFormVisible] = useState(false); // 控制 PostForm 顯示狀態

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  // const handlePostCreated = (newPost) => {
  //   setPosts([newPost, ...posts]); // 將新貼文推到最上面
  // };

  const togglePostForm = () => {
    setIsPostFormVisible(!isPostFormVisible); // 切換 PostForm 的顯示狀態
  };

  return (
    <>
      <main>
        {/* 新增貼文按鈕 */}
        <div className="side-div">
          <img src='/img/earth-write.jpg'></img>
          <button className="new-post-button" onClick={togglePostForm}>
            新增貼文
          </button>
        </div>

        {/* Conditionally render PostForm */}
        {isPostFormVisible && (
          <PostForm
            token={token}
            showLoading={showLoading}
            hideLoading={hideLoading}
            onClose={togglePostForm}
          />
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <PostList posts={posts} userId={userId} />
        )}
      </main>
    </>
  );
};

export default HomePage;
