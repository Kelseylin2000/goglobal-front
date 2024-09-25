import React, { useContext, useEffect, useState } from 'react';

import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';

import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const {token, userId} = useContext(AuthContext);

  // const { isSavedModalOpen, savedPosts,toggleSavedPostsModal} = useContext(SaveContext);
  const { posts, setPosts, loadPosts } = useContext(PostContext);

  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]); // 將新貼文推到最上面
  };

  // useEffect(() => {
  //   loadPosts();
  // }, []);

  return (
    <>
      {/* <Header toggleSavedPostsModal={toggleSavedPostsModal} /> */}
      <main>
        <PostForm token={token} onPostCreated={handlePostCreated} showLoading={showLoading} hideLoading={hideLoading} />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <PostList
            posts={posts}
            userId={userId}
          />
        )}
      </main>
    </>
  );
};

export default HomePage;
