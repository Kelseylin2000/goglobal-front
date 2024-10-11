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
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const togglePostForm = () => {
    setIsPostFormVisible(!isPostFormVisible);
  };

  return (
    <>
      <main>
        <div className="side-div">
          <img src='/img/earth-write.jpg'></img>
          <button className="new-post-button" onClick={togglePostForm}>
            新增貼文
          </button>
        </div>

        {isPostFormVisible && (
          <PostForm
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
