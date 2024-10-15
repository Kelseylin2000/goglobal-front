import React, { useContext, useState, useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';

import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { userId } = useContext(AuthContext);
  const { posts, loadPosts, hasMore, loading } = useContext(PostContext);

  const [isPostFormVisible, setIsPostFormVisible] = useState(false);

  const togglePostForm = () => {
    setIsPostFormVisible(!isPostFormVisible);
  };

  // 添加滾動事件監聽器
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.offsetHeight;

      // 當用戶滾動到距離底部 100px 以內時加載更多貼文
      if (documentHeight - (scrollTop + windowHeight) <= 100) {
        loadPosts();
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 在組件卸載時移除事件監聽器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore, loadPosts]);

  return (
    <>
      <main>
        <div className="side-div">
          <img src="/img/earth-write.jpg" alt="Earth Write" />
          <button className="new-post-button" onClick={togglePostForm}>
            新增貼文
          </button>
        </div>

        {isPostFormVisible && <PostForm onClose={togglePostForm} />}

        <PostList posts={posts} userId={userId} />

        {loading && <LoadingSpinner />}
        {!hasMore && <p style={{ textAlign: 'center' }}>沒有更多貼文了</p>}
      </main>
    </>
  );
};

export default HomePage;
