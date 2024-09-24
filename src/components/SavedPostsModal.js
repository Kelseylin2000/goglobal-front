import React from 'react';
import PostList from './PostList';

const SavedPostsModal = ({
    savedPosts,
    toggleSavedPostsModal,
    userId
}) => {
  return (
    <div className="modal" onClick={toggleSavedPostsModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={toggleSavedPostsModal}>
          &times;
        </button>
        <h2>我的收藏</h2>
        <div id="savedPosts">
          {savedPosts.length > 0 ? (
            <PostList
              posts={savedPosts}
              userId={userId}
            />
          ) : (
            <p className="no-saved-posts">你還沒有收藏的貼文，快去收藏吧！</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPostsModal;